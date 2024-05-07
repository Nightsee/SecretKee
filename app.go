package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"secretkeepkg/controllers"
	"secretkeepkg/models"
	"secretkeepkg/utilities"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
	//check if file is empty if it is fill it
	tmp := utilities.ParseDataV2()
	if tmp.Username == "" {
		tmpw := "username admin \npassword $2a$06$O2gom4IdC5reyGgaiG6GEOvPNsdqxVe9WWkQt8QnZQo.MTVMKCiJy \ncost 6 \ndata nil"
		if err := ioutil.WriteFile("./localstorage/locds.ds", []byte(tmpw), 0600); err != nil {
			log.Fatal(err)
		}
	}
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	// make sure to save everything before the app closes
	if err := utilities.WriteDataV2(SessionAccount); err != nil {
		return true
	}
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// my logic goes here

var SessionAccount models.ADMINV2

type plistFetch struct {
	Status        bool     `json:"status"`
	PasswordsList []string `json:"passwordsList"`
}
type GenerateResponse struct {
	Status bool   `json:"status"`
	Psd    string `json:"password"`
}
type RegenerateResponse struct {
	Status bool   `json:"status"`
	Psd    string `json:"password"`
}
type DeleteResponse struct {
	Status bool `json:"status"`
}

func (a *App) Logout() string {
	response := &DeleteResponse{}
	if err := utilities.WriteDataV2(SessionAccount); err != nil {
		response.Status = false
		responseJson, _ := json.Marshal(response)
		return string(responseJson)
	} else {
		SessionAccount = models.ADMINV2{
			Username: "",
			Password: nil,
			Cost:     0,
			Data:     nil,
		}
		response.Status = true
		responseJson, _ := json.Marshal(response)
		return string(responseJson)
	}
}
func (a *App) Connect(uname string, psd string) string {
	creds := models.Account{Username: uname, Password: psd}
	account := utilities.ParseDataV2()
	// fmt.Println(len(creds.Username))
	// fmt.Println(len(account.Username))
	if creds.Username == account.Username {
		passwordMatch, _ := utilities.VerifyPassword(string(account.Password), creds.Password)
		if passwordMatch {
			SessionAccount = account
			response := &models.ConnectResponse{Status: true, Account: account}
			resJson, _ := json.Marshal(response)
			return string(resJson)
		} else {
			response := &models.ConnectResponse{Status: false, Account: models.ADMINV2{Username: "", Password: nil, Cost: 0, Data: nil}}
			resJson, _ := json.Marshal(response)
			return string(resJson)
		}
	} else {
		response := &models.ConnectResponse{Status: false, Account: models.ADMINV2{Username: "", Password: nil, Cost: 0, Data: nil}}
		resJson, _ := json.Marshal(response)
		return string(resJson)
	}
}

func (a *App) GetData() string {
	account := utilities.ParseDataV2()
	accountJson, _ := json.Marshal(account)
	return string(accountJson)
}

func (a *App) GetPlist() string {
	account := utilities.ParseDataV2()
	response := &plistFetch{Status: true, PasswordsList: account.Data}
	accountJson, _ := json.Marshal(response)
	return string(accountJson)
}

func (a *App) AppGenerateV2(website string, opts utilities.GenerateOptions) string {
	generatedPassword := utilities.GeneratePassword(opts)
	SessionAccount.Data = append(SessionAccount.Data, website, generatedPassword)
	//fmt.Println(SessionAccount.Data)
	if err := utilities.WriteDataV2(SessionAccount); err != nil {
		log.Fatal(err)
	}
	var tmpResponse *GenerateResponse = &GenerateResponse{Status: true, Psd: generatedPassword}
	responseJson, _ := json.Marshal(tmpResponse)
	return string(responseJson)
}

func (a *App) RegeneratePassword(website string) string {
	generatedPassword, _ := controllers.RegeneratePassword(website, &SessionAccount)
	if err := utilities.WriteDataV2(SessionAccount); err != nil {
		log.Fatal(err)
	}
	var tmpResponse *GenerateResponse = &GenerateResponse{Status: true, Psd: generatedPassword}
	responseJson, _ := json.Marshal(tmpResponse)
	return string(responseJson)
}

func (a *App) DeletePassword(website string) string {
	if err := controllers.DeletePassword(website, &SessionAccount); err != nil {
		log.Fatal(err)
	}
	if err := utilities.WriteDataV2(SessionAccount); err != nil {
		log.Fatal(err)
	}
	response := &DeleteResponse{Status: true}
	responesJson, _ := json.Marshal(response)
	return string(responesJson)
}

type UsernameUpdateResponse struct {
	Status bool   `json:"status"`
	Body   string `json:"body"`
}

func (a *App) UpdateUsername(newUsername string, newPassword string) string {
	//
	newUsername = strings.TrimSpace(newUsername)
	newPassword = strings.TrimSpace(newPassword)
	if newUsername != "" && len(newUsername) > 3 {
		if newUsername != "admin" {
			SessionAccount.Username = newUsername
			if err := utilities.WriteDataV2(SessionAccount); err != nil {
				log.Fatal(err)
			}
			reponse := &UsernameUpdateResponse{Status: true, Body: "username updated"}
			response_json, _ := json.Marshal(reponse)
			return string(response_json)
		}
	}
	if newPassword != "" {
		// check if
		newPassword += ""
	}
	reponse := &UsernameUpdateResponse{Status: false, Body: "couldn't update"}
	response_json, _ := json.Marshal(reponse)
	return string(response_json)
}

type RefetchResponse struct {
	Status   bool   `json:"status"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (a *App) RefetchAccountPage() string {
	resp := &RefetchResponse{Status: true, Username: SessionAccount.Username, Password: string(SessionAccount.Password)}
	respJson, _ := json.Marshal(resp)
	return string(respJson)
}
