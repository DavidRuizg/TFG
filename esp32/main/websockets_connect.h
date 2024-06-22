#ifndef WEBSOCKETS_CONNECT_H
#define WEBSOCKETS_CONNECT_H

#include "pzem004t_comm.h"

void websockets_connect_init(void);
void websockets_disconnect(void);

int websockets_send(char* esp32_id, char* message, struct power_values_s* power_values);
int relay_status_send(char* esp32_id, char* message, uint8_t relay, uint8_t relay_state);

#endif // WEBSOCKETS_CONNECT_H