package utilities

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"secretkeepkg/models"
	"strconv"
	"strings"
)

const FilePath = "./localstorage/locds.ds"

var Admin models.ADMIN
var Adminv2 models.ADMINV2

type Credentials models.Account

func WriteData(acc models.ADMIN) error {
	data := PopulateData(acc.Username, string(acc.Password), acc.Cost, acc.Data)
	if err := ioutil.WriteFile(FilePath, []byte(data), 0600); err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

func WriteDataV2(acc models.ADMINV2) error {
	data := PopulateDataV2(acc.Username, string(acc.Password), acc.Cost, acc.Data)
	if err := ioutil.WriteFile(FilePath, []byte(data), 0600); err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

func ReadData() (string, error) {
	data, err := os.ReadFile(FilePath)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	return string(data), nil
}

func CheckIfUsersExist() (bool, string) {
	data, _ := ReadData()
	if data == "" {
		return false, ""
	}
	return true, string(data)
}

func ParseDataField(data string) map[string]string {
	var dataMap = make(map[string]string)
	if data == "nil" {
		return dataMap
	}
	paires := strings.Split(data, "&")
	for _, paire := range paires {
		paireElements := strings.Split(paire, ":")
		dataMap[paireElements[0]] = paireElements[1]
	}
	return dataMap
}

func ParseDataFieldV2(data string) []string {
	var dataMap []string
	if data == "nil" {
		return dataMap
	}
	paires := strings.Split(data, "&")
	for _, paire := range paires {
		paireElements := strings.Split(paire, ":")
		decryptedPsd, _ := Decrypt(paireElements[1])
		paireElements[1] = decryptedPsd
		dataMap = append(dataMap, paireElements...)
	}
	return dataMap
}

func ParseDataV2() models.ADMINV2 {
	result, data := CheckIfUsersExist()
	if !result {
		return models.ADMINV2{Username: "", Password: nil, Cost: 10, Data: nil}
	}
	var tmpData = make(map[string]string)
	lines := strings.Split(data, "\n")

	for _, line := range lines {
		lineData := strings.Split(line, " ")
		tmpData[lineData[0]] = lineData[1]
	}
	cost, _ := strconv.ParseInt(tmpData["cost"], 10, 8)
	Adminv2 = models.ADMINV2{
		Username: tmpData["username"],
		Password: []byte(tmpData["password"]),
		Cost:     int8(cost),
		Data:     ParseDataFieldV2(tmpData["data"]),
	}
	return Adminv2
}

func ParseData() models.ADMIN {
	result, data := CheckIfUsersExist()
	if !result {
		return models.ADMIN{Username: "", Password: nil, Cost: 0, Data: nil}
	}
	var tmpData = make(map[string]string)
	lines := strings.Split(data, "\n")

	for _, line := range lines {
		lineData := strings.Split(line, " ")
		tmpData[lineData[0]] = lineData[1]
	}
	cost, _ := strconv.ParseInt(tmpData["cost"], 10, 8)
	Admin = models.ADMIN{
		Username: tmpData["username"],
		Password: []byte(tmpData["password"]),
		Cost:     int8(cost),
		Data:     ParseDataField(tmpData["data"]),
	}
	return Admin
}

func PopulateData(username string, password string, cost int8, dataMap map[string]string) string {
	var tmpString = ""
	for key, psd := range dataMap {
		if len(tmpString) == 0 {
			tmpString = fmt.Sprintf("%v:%v", key, psd)
		} else {
			tmpString = tmpString + fmt.Sprintf("&%v:%v", key, psd)
		}
	}
	return fmt.Sprintf("username %v \npassword %v \ncost %v \ndata %v", username, password, cost, tmpString)
}

func PopulateDataV2(username string, password string, cost int8, dataMap []string) string {
	var tmpString = ""
	if len(dataMap) == 1 && dataMap[0] == "" {
		dataMap = []string{}
	}

	for i := 0; i < len(dataMap); i += 2 {
		keyy := dataMap[i]
		vall, _ := Encrypt(dataMap[i+1])
		if len(tmpString) == 0 {
			tmpString = fmt.Sprintf("%v:%v", keyy, vall)
		} else {
			tmpString = tmpString + fmt.Sprintf("&%v:%v", keyy, vall)
		}
	}
	if len(dataMap) == 0 {
		tmpString = "nil"
	}
	return fmt.Sprintf("username %v \npassword %v \ncost %v \ndata %v", username, password, cost, tmpString)
}
