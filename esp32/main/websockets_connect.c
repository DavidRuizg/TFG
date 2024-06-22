#include <stdio.h>
#include <string.h>
#include "esp_log.h"
#include "esp_websocket_client.h"
#include "sys/time.h"
#include "websockets_connect.h"
#include <cJSON.h>

#include "i2c_relay_comm.h"

static const char* TAG = "WEBSOCKET";
static esp_websocket_client_handle_t client;

void websocket_event_handler(void* event_handler_arg, esp_event_base_t event_base,
                             int32_t event_id, void* event_data)
{
    esp_websocket_event_data_t *data = (esp_websocket_event_data_t *)event_data;
    switch (event_id)
    {
    case WEBSOCKET_EVENT_CONNECTED:
        ESP_LOGI(TAG, "WEBSOCKET_EVENT_CONNECTED");
        break;
    case WEBSOCKET_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "WEBSOCKET_EVENT_DISCONNECTED");
        break;
    case WEBSOCKET_EVENT_DATA:
        ESP_LOGI(TAG, "Datos recibidos=%.*s", data->data_len, (char *)data->data_ptr);
        cJSON *data_json = cJSON_Parse(data->data_ptr);    
        if (data_json == NULL)
        {
            ESP_LOGW(TAG, "Mensaje JSON vacío");
            break;
        }
        else 
        {
            cJSON *type_json = cJSON_GetObjectItem(data_json, "Type");
            char *type = cJSON_GetStringValue(type_json);

            if (strcmp(type, "order") == 0)
            {
                cJSON *relay_json = cJSON_GetObjectItem(data_json, "Relay");
                cJSON *state_json = cJSON_GetObjectItem(data_json, "State");
                if (cJSON_IsNumber(relay_json) && cJSON_IsNumber(state_json)) 
                {
                    int relay = relay_json->valueint;
                    int state = state_json->valueint;
                    if (state == 0 || state == 1)
                    {
                        if (relay >= 0 && relay < 4)
                        {                                                
                            ESP_LOGI(TAG, "Solicitud para cambiar el estado del relé %d a %s", relay, (state == 0) ? "APAGADO" : "ENCENDIDO");
                            i2c_set_relay_state(relay, state);
                        }
                        else
                        {
                            ESP_LOGW(TAG, "Valor de relé incorrecto: %d", relay);
                        }
                    }
                    else 
                    {
                        ESP_LOGW(TAG, "Valor de estado incorrecto: %d", state);
                    }
                }
            }            
        }
        break;
    default:
        break;
    }
}

void websockets_connect_init(void)
{
    // Iniciar cliente para utilizar los websockets
    esp_websocket_client_config_t websocket_cfg = {
        .uri = "ws://192.168.216.210:8080", 
        .network_timeout_ms = 5000,
        .reconnect_timeout_ms = 5000,
    };
    client = esp_websocket_client_init(&websocket_cfg);
    ESP_ERROR_CHECK(esp_websocket_register_events(client, WEBSOCKET_EVENT_ANY, websocket_event_handler, NULL));
    ESP_ERROR_CHECK(esp_websocket_client_start(client));
}

static void message_to_json(char* esp32_id, char* message, struct power_values_s* power_values)
{
    time_t now = time(NULL);
    struct tm *local = localtime(&now);
    char currentDateTime[100];

    const char* formatDate = "%d-%m-%Y %H:%M:%S";

    int bytes = strftime(currentDateTime, sizeof(currentDateTime), formatDate, local);

    if (bytes != 0)
    {
        char currentDate[11];
        char currentTime[9];

        strncpy(currentDate, currentDateTime, 10);
        currentDate[10] = '\0';

        strncpy(currentTime, currentDateTime + 11, 8);
        currentTime[8] = '\0';

        sprintf(message, "{"
                     "\"Type\": \"data\","
                     "\"ID\": \"%s\","
                     "\"Potencia\": %.2f,"
                     "\"Voltaje\": %.2f,"
                     "\"Intensidad\": %.2f,"
                     "\"Energia\": %.2f,"
                     "\"Frecuencia\": %.2f,"
                     "\"FactorPotencia\": %.2f,"
                     "\"Fecha\": \"%s\","
                     "\"Hora\": \"%s\""
                     "}",
                     esp32_id, power_values->power,
                     power_values->voltage, power_values->current,
                     power_values->energy, power_values->frequency,
                     power_values->power_factor, currentDate, currentTime);
    }
    else
    {
        ESP_LOGE(TAG, "Error al obtener la fecha y hora");
    }
}

int relay_status_send(char* esp32_id, char* message, uint8_t relay, uint8_t relay_state)
{
    sprintf(message, "{"
                     "\"Type\": \"state\","
                     "\"ID\": \"%s\","
                     "\"Relay\": %d,"
                     "\"State\": %d"
                     "}",
                     esp32_id, relay, relay_state);
    return esp_websocket_client_send_text(client, message, strlen(message), portMAX_DELAY);
}

int websockets_send(char* esp32_id, char* message, struct power_values_s* power_values)
{
    message_to_json(esp32_id, message, power_values);
    ESP_LOGI(TAG, "Enviando mensaje mediante Websockets: %s", message);

    return esp_websocket_client_send_text(client, message, strlen(message), portMAX_DELAY);
}


void websockets_disconnect(void)
{
    esp_websocket_client_close(client, pdMS_TO_TICKS(1000));
}