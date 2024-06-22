#ifndef PZEM004_H
#define PZEM004_H

#include <stdint.h>

struct power_values_s {
    float voltage;
    float current;
    float power;
    float energy;
    float frequency;
    float power_factor;
    uint32_t alarms;
};

int update_values_cmd(char* data_frame, int* length);
int parse_values(char* dataframe, struct power_values_s* power_values);

#endif // PZEM004_H