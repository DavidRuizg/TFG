#ifndef SNTP_H
#define SNTP_H

#include "common.h"
#include "esp_sntp.h"

void on_got_time(struct timeval *tv);
void sntp_setup();

#endif // SNTP_H