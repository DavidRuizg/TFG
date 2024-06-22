#ifndef I2C_RELAY_COMM_H
#define I2C_RELAY_COMM_H

void i2c_master_init();

esp_err_t i2c_relay_write(uint8_t register_address, uint8_t data);

void i2c_relay_init();
int i2c_set_relay_state(uint8_t relay_number, bool state);

void relay_off(uint8_t relay_number);
void relay_on(uint8_t relay_number);

#endif // I2C_RELAY_COMM_H