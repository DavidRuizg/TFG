#include "sntp.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *TAG = "SNTP";

void on_got_time(struct timeval *tv) {
    setenv("TZ", "CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00", 1);
    tzset();
}

void sntp_setup(void) {
    ESP_LOGI(TAG, "Iniciando configuración SNTP...");
    sntp_set_sync_mode(SNTP_SYNC_MODE_IMMED);
    esp_sntp_setservername(0, "pool.ntp.org");
    esp_sntp_init();
    sntp_set_time_sync_notification_cb(on_got_time);
    ESP_LOGI(TAG, "Configuración SNTP completada.");
    vTaskDelay(3000 / portTICK_PERIOD_MS);
}
