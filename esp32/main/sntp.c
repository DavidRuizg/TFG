#include "sntp.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *TAG = "SNTP";

/* Funcion para establecer la zona horaria
*
*  Parametros:
*  - tv: Estructura con la hora actual
*
*  Retorno:
*  Sin retorno
*
*/
void on_got_time(struct timeval *tv) {
    setenv("TZ", "CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00", 1);
    tzset();
}

/* Funcion para configurar el SNTP
*
*  Parametros:
*  Sin parametros
*
*  Retorno:
*  Sin retorno
*
*/
void sntp_setup(void) {
    ESP_LOGI(TAG, "Iniciando configuración SNTP...");
    // Sin sincronización inmediata
    sntp_set_sync_mode(SNTP_SYNC_MODE_IMMED);
    // Selección de servidor SNTP
    esp_sntp_setservername(0, "pool.ntp.org");
    // Inicio de la sincronización
    esp_sntp_init();
    // Callback para notificación de sincronización
    sntp_set_time_sync_notification_cb(on_got_time);
    ESP_LOGI(TAG, "Configuración SNTP completada.");
    // Espera de 3 segundos para permitir que la sincronizacion se complete antes del inicio de otros procesos
    vTaskDelay(3000 / portTICK_PERIOD_MS);
}
