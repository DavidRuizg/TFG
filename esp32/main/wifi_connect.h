#ifndef WIFI_CONNECT_H
#define WIFI_CONNECT_H

void wifi_connect_init(void);
esp_err_t wifi_connect_station(const char* ssid, const char* password, int timeout);
esp_err_t wifi_connect_demo(void);
void wifi_disconnect(void);

#endif // WIFI_CONNECT_H