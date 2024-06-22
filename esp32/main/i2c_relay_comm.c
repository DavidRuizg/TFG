#include <stdio.h>
#include "driver/i2c.h"
#include "esp_log.h"
#include "sdkconfig.h"
#include "websockets_connect.h"

#define I2C_MASTER_SCL_IO           22    // Puerto GPIO designado para SCL
#define I2C_MASTER_SDA_IO           21    // Puerto GPIO designado para SDA
#define I2C_MASTER_NUM              I2C_NUM_0  // Puerto I2C
#define I2C_MASTER_FREQ_HZ          100000
#define I2C_MASTER_TX_BUF_DISABLE   0
#define I2C_MASTER_RX_BUF_DISABLE   0
#define I2C_TIMEOUT_MS              1000

#define XL9535_ADDR 0x20   // Direcciono I2C de la placa de reles + XL9535

#define ESP32_ID "ESP32_1"

static const char *TAG = "PLACA_RELES";
static uint8_t relay_state = 0;

void i2c_master_init()
{
    ESP_LOGI(TAG, "Estableciendo configuración I2C...");
    i2c_config_t i2c_config = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = I2C_MASTER_FREQ_HZ,
    };
    i2c_param_config(I2C_MASTER_NUM, &i2c_config);

    ESP_LOGI(TAG, "Inicializando driver I2C...");
    i2c_driver_install(I2C_MASTER_NUM, i2c_config.mode, I2C_MASTER_RX_BUF_DISABLE, I2C_MASTER_TX_BUF_DISABLE, 0);
}

esp_err_t i2c_relay_write(uint8_t register_address, uint8_t data)
{
    i2c_cmd_handle_t i2c_cmd_handle = i2c_cmd_link_create();
    ESP_ERROR_CHECK(i2c_master_start(i2c_cmd_handle));
    
    ESP_ERROR_CHECK(i2c_master_write_byte(i2c_cmd_handle, (XL9535_ADDR << 1) | I2C_MASTER_WRITE, true));
    ESP_ERROR_CHECK(i2c_master_write_byte(i2c_cmd_handle, register_address, true));
    ESP_ERROR_CHECK(i2c_master_write_byte(i2c_cmd_handle, data, true));
    
    ESP_ERROR_CHECK(i2c_master_stop(i2c_cmd_handle));
    
    esp_err_t ret = i2c_master_cmd_begin(I2C_MASTER_NUM, i2c_cmd_handle, I2C_TIMEOUT_MS / portTICK_PERIOD_MS);

    i2c_cmd_link_delete(i2c_cmd_handle);
    return ret;
}

int i2c_set_relay_state(uint8_t relay_number, bool state)
{
    uint8_t reg_val = relay_state;
    esp_err_t ret;

    if (state) 
    {
        reg_val |= (1 << relay_number);
    } 
    else 
    {
        reg_val &= ~(1 << relay_number);
    }

    ret = i2c_relay_write(0x02, reg_val);
    relay_state = reg_val;
    if (ret == ESP_OK) 
    {
        ESP_LOGI(TAG, "Relé %d %s", relay_number, state ? "ENCENDIDO" : "APAGADO");

        char message[50];
        relay_status_send(ESP32_ID, message, relay_number, state);

        return 0;
    } 
    else 
    {
        ESP_LOGE(TAG, "Error al cambiar el estado del relé %d a %s.", relay_number, state ? "ENCENDIDO" : "APAGADO");
        
        return -1;
    }
}

void relay_off(uint8_t relay_number)
{
    i2c_set_relay_state(relay_number, false);
}

void relay_on(uint8_t relay_number)
{
    i2c_set_relay_state(relay_number, true);
}

void i2c_relay_init()
{
    i2c_relay_write(0x06, 0x00);
    i2c_relay_write(0x07, 0x00);
    relay_off(0);
    relay_off(1);
    relay_off(2);
    relay_off(3);
}