package controllers

import (
	"secretkeepkg/models"
	"secretkeepkg/utilities"
)

func DeletePassword(psKey string, acc *models.ADMINV2) error {
	var tmpList []string = []string{}
	for i := 0; i < len(acc.Data); i += 2 {
		if acc.Data[i] != psKey {
			tmpList = append(tmpList, acc.Data[i], acc.Data[i+1])
		}
	}

	acc.Data = tmpList
	return nil
}

// store the opts of every password so that i can use it again in regeneration
func RegeneratePassword(psKey string, acc *models.ADMINV2) (string, error) {
	newPassword := utilities.GeneratePassword(utilities.RegenOPS)
	for i := 0; i < len(acc.Data); i += 2 {
		if acc.Data[i] == psKey {
			acc.Data[i+1] = newPassword
		}
	}
	return newPassword, nil
}
