package main

import (
	"fmt"
	"log"
	"net/http"
)

// Basic server for local development

func main() {

	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	port := "8080"
	fmt.Printf("Server running at http://localhost:%s\n", port)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal(err)
	}
}
