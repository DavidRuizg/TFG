#ifndef MQTT_CONNECT_H
#define MQTT_CONNECT_H

#include "pzem004t_comm.h"

void mqtt_connect_init(void);
void mqtt_disconnect(void);

int mqtt_send(char* topic, char* payload);
int mqtt_send_telemetry(char* esp32_id, struct power_values_s* power_values);

#endif // MQTT_CONNECT_H