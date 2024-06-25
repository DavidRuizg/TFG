#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "nvs_flash.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "wifi_connect.h"
#include "mqtt_connect.h"
#include "websockets_connect.h"
#include "pzem004t_comm.h"
#include "i2c_relay_comm.h"
#include "sntp.h"

#include "driver/uart.h"
#include "driver/gpio.h"

#define PIN_TXD 17
#define PIN_RXD 16
#define PIN_RTS (UART_PIN_NO_CHANGE)
#define PIN_CTS (UART_PIN_NO_CHANGE)

#define UART_PORT_NUM 1
#define UART_BAUD_RATE 9600
#define TASK_STACK_SIZE 8000

#define ESP32_ID "ESP32_1"

static const char *TAG = "MAIN";

#define BUF_SIZE (1024)

/* Tarea principal ejecutada por el programa, incluye la configuracion de la UART en primera instancia y la lectura periódica de datos del PZEM004T seguido del envio de estos mediante MQTT y Websockets 
*
*  Parametros:
*  - arg: Argumentos de la tarea (no requeridos)
*
*  Retorno:
*  Sin retorno
*/
static void main_task(void *arg)
{
    // Configuracion de UART estableciendo el baudrate, bits de datos, paridad, bits de parada, control de flujo y reloj de sincronización
    uart_config_t uart_config = {
        .baud_rate = UART_BAUD_RATE,
        .data_bits = UART_DATA_8_BITS,
        .parity    = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_DEFAULT,
    };
    int intr_alloc_flags = 0;

#if CONFIG_UART_ISR_IN_IRAM
    intr_alloc_flags = ESP_INTR_FLAG_IRAM;
#endif
    // Instalacion del driver de la UART
    ESP_ERROR_CHECK(uart_driver_install(UART_PORT_NUM, BUF_SIZE * 2, 0, 0, NULL, intr_alloc_flags));
    // Configuracion de los pines de la UART
    ESP_ERROR_CHECK(uart_param_config(UART_PORT_NUM, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(UART_PORT_NUM, PIN_TXD, PIN_RXD, PIN_RTS, PIN_CTS));

    // Buffer para los comandos y datos recibidos por la UART
    uint8_t *data = (uint8_t *) malloc(BUF_SIZE);
    int length;
    struct power_values_s power_values;

    while (true) 
    {
        // Generar el comando de lectura de valores
        update_values_cmd((char*)data, &length);
        // Enviar el comando por la UART
        uart_write_bytes(UART_PORT_NUM, data , length);
        ESP_LOGI(TAG, "Leyendo datos del PZEM004T mediante UART...");
        // Leer los datos recibidos por la UART 
        int len = uart_read_bytes(UART_PORT_NUM, data, (BUF_SIZE - 1), 1000 / portTICK_PERIOD_MS);
        if (len > 0)    // Si se recibieron datos
        {
            ESP_LOGI(TAG, "Recibido: %d bytes", len);
            // Convertir los datos a valores de los parámetros eléctricos
            parse_values((char*)data, &power_values);

            // Convertir los valores a un mensaje JSON y envio mediante websockets
            char messageJSON[256];
            websockets_send(ESP32_ID, messageJSON, &power_values);
            
            // Enviar los valores mediante MQTT
            mqtt_send_telemetry(ESP32_ID, &power_values);
        }
        vTaskDelay(2000 / portTICK_PERIOD_MS);
    }
}

/* Proceso principal del programa. Realiza configuraciones iniciales para conexión Wi-Fi, SNTP, MQTT, Websockets e I2C, y crea las tareas necesarias para la ejecución del programa
*
*  Parametros:
*  Sin parametros de entrada
*
*  Retorno:
*  Sin retorno
*
*/
void app_main(void)
{
    // Inicializar la memoria de almacenamiento no volátil
    ESP_ERROR_CHECK(nvs_flash_init());
    // Iniciar conexion wifi
    wifi_connect_init();
    ESP_ERROR_CHECK(wifi_connect_demo());
    // Iniciar SNTP para obtener la fecha y hora actuales
    sntp_setup();
    // Iniciar conexion MQTT
    mqtt_connect_init();
    // Iniciar conexion Websockets
    websockets_connect_init();
    // Iniciar comunicacion I2C con la placa de reles
    i2c_master_init();
    i2c_relay_init();
    
    // Crear tarea para leer datos del PZEM004T
    xTaskCreate(main_task, "main_task", TASK_STACK_SIZE, NULL, 10, NULL);
}

