#include <stdio.h>
#include <string.h>
#include "esp_log.h"
#include "mqtt_client.h"
#include "mqtt_connect.h"


static const char* TAG = "MQTT";
static esp_mqtt_client_handle_t client;

void mqtt_event_handler(void* event_handler_arg, esp_event_base_t event_base, 
                        int32_t event_id, void* event_data)
{
    esp_mqtt_event_handle_t event = event_data;

    switch ((esp_mqtt_event_id_t) event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;
    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED");
        break;
    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED");
        break;
    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED");
        break;
    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGE(TAG, "ERROR %s", strerror(event->error_handle->esp_transport_sock_errno));
        break;
    default:
        break;
    }
}

void mqtt_connect_init(void)
{
    // Definir configuracion del cliente MQTT
    esp_mqtt_client_config_t esp_mqtt_client_config = {
        // Estableciendo el URI del broker incluyendo ruta y puerto
       .broker.address.uri = "mqtt://192.168.216.210:1883",
    };
    // Inicializar el cliente MQTT
    client = esp_mqtt_client_init(&esp_mqtt_client_config);
    // Inicializar registrador de eventos
    ESP_ERROR_CHECK(esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL));
    // Iniciar conexion con el broker
    esp_mqtt_client_start(client);
}

int mqtt_send(char* topic, char* payload)
{
    return esp_mqtt_client_publish(client, topic, payload, strlen(payload), 0, 0);
}

int mqtt_send_telemetry(char* esp32_id, struct power_values_s* power_values)
{
    ESP_LOGI(TAG, "Enviando valores mediante MQTT");
    char message[256];
    char topic[256] = "iotsys/mediciones/casa1/";
    
    // For every message, we need to add the ESP32 ID to the topic along with the message value type. Example of topic: iotsys/mediciones/casa1/esp32_id/Potencia
    ESP_LOGI(TAG, "Enviando valores de Potencia mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/Potencia", esp32_id);
    sprintf(message, "%.2f", power_values->power);
    mqtt_send(topic, message);

    ESP_LOGI(TAG, "Enviando valores de Voltaje mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/Voltaje", esp32_id);
    sprintf(message, "%.2f", power_values->voltage);
    mqtt_send(topic, message);

    ESP_LOGI(TAG, "Enviando valores de Intensidad mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/Intensidad", esp32_id);
    sprintf(message, "%.2f", power_values->current);
    mqtt_send(topic, message);

    ESP_LOGI(TAG, "Enviando valores de Energia mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/Energia", esp32_id);
    sprintf(message, "%.2f", power_values->energy);
    mqtt_send(topic, message);

    ESP_LOGI(TAG, "Enviando valores de Frecuencia mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/Frecuencia", esp32_id);
    sprintf(message, "%.2f", power_values->frequency);
    mqtt_send(topic, message);

    ESP_LOGI(TAG, "Enviando valores de Factor de Potencia mediante MQTT");
    sprintf(topic, "iotsys/mediciones/casa1/%s/FactorPotencia", esp32_id);
    sprintf(message, "%.2f", power_values->power_factor);
    mqtt_send(topic, message);

    return 0;
}

void mqtt_disconnect(void)
{
    ESP_ERROR_CHECK(esp_mqtt_client_stop(client));
    ESP_ERROR_CHECK(esp_mqtt_client_destroy(client));
}