package models

type ADMIN struct {
	Username string
	Password []byte
	Cost     int8
	Data     map[string]string
}
type ADMINV2 struct {
	Username string
	Password []byte
	Cost     int8
	Data     []string
}
type Account struct {
	Username string
	Password string
}

type ConnectResponse struct {
	Status  bool    `json:"status"`
	Account ADMINV2 `json:"account"`
}
