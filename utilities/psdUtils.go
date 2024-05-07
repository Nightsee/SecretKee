package utilities

import (
	"fmt"
	"reflect"
	"unicode"

	password2 "github.com/sethvargo/go-password/password"
	"golang.org/x/crypto/bcrypt"
)

const (
	MinCost     int = 4  // the minimum allowable cost as passed in to GenerateFromPassword
	MaxCost     int = 16 // the maximum allowable cost as passed in to GenerateFromPassword
	DefaultCost int = 10 // the cost that will actually be set if a cost below MinCost is passed into GenerateFromPassword
	MinLength   int = 8
	MaxLenght   int = 18
)

type GenerateOptions struct {
	Digits            bool
	Characters        bool
	SpecialCharacters bool
}

var RegenOPS = GenerateOptions{
	Digits:            true,
	Characters:        true,
	SpecialCharacters: true,
}

func removeDigits(input string) string {
	result := ""
	for _, char := range input {
		if !unicode.IsDigit(char) {
			result += string(char)
		}
	}
	return result
}
func removeSpecialCharacters(input string) string {
	result := ""
	for _, char := range input {
		if unicode.IsLetter(char) || unicode.IsDigit(char) || unicode.IsSpace(char) {
			result += string(char)
		}
	}
	return result
}
func removeCharacters(input string) string {
	result := ""
	for _, char := range input {
		if !unicode.IsLetter(char) {
			result += string(char)
		}
	}
	return result
}

func GeneratePassword(ops GenerateOptions) string {
	/*
		- add option to choose the password length and complexity.
		complexity of password : choose if the password shood contain
								numbers characters and special characters
	*/
	password, _ := password2.Generate(MaxLenght, 6, 6, false, false)
	values := reflect.ValueOf(ops)
	types := values.Type()
	for i := 0; i < values.NumField(); i++ {
		tmpstr := fmt.Sprintf("%v", values.Field(i))
		if tmpstr == "false" {
			switch types.Field(i).Name {
			case "Digits":
				password = removeDigits(password)
			case "Characters":
				password = removeCharacters(password)
			case "SpecialCharacters":
				password = removeSpecialCharacters(password)
			}
		} else {
			password = password[0:12]
		}
	}
	// tmp := PreparePassword(password)
	// return tmp
	return password
}

func PreparePassword(password string) (ps string) {
	var characters = "&#'[]()`{}/\\^^¨¤$£!§*µ;:,"
	for _, el := range password {
		var IsSpecial bool = false
		for _, c := range characters {
			if c == el {
				ps += "@"
				IsSpecial = true
				break
			}
		}
		if !IsSpecial {
			ps += string(el)
		}
	}
	return
}

func HashPassword(pswrd string, cost int) (password []byte, err error) {
	password, _ = bcrypt.GenerateFromPassword([]byte(pswrd), cost)
	return password, nil
}

func VerifyPassword(hashedPassword string, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err == nil {
		return true, nil
	}
	// log.Fatal(err)
	// fmt.Println("wrong password")
	return false, err
}
