package libstar

import (
	"crypto/tls"
	"golang.org/x/net/websocket"
	"io"
	"net/http"
	"net/url"
	"sync"
)

type Auth struct {
	Type     string
	Username string
	Password string
}

type Proxy struct {
	Auth      Auth
	Prefix    string
	Server    string
	Url       *url.URL
	TlsConfig *tls.Config
}

func (pri *Proxy) Initialize() {
	pri.Url, _ = url.Parse(pri.Server)
	pri.TlsConfig = &tls.Config{InsecureSkipVerify: true}
}

func (pri *Proxy) GetPath(req *http.Request) string {
	path := req.URL.Path
	size := len(pri.Prefix)
	if size > 0 && len(path) >= size {
		path = path[size:]
	}
	return path + "?" + req.URL.RawQuery
}

type ProxyUrl struct {
	Proxy
	Transport *http.Transport
}

func (pri *ProxyUrl) Initialize() {
	pri.Proxy.Initialize()
	pri.Transport = &http.Transport{
		TLSClientConfig: pri.TlsConfig,
	}
}

func (pri *ProxyUrl) ServeHttp(w http.ResponseWriter, r *http.Request) {
	rs, err := pri.Transport.RoundTrip(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer rs.Body.Close()
	for key, value := range rs.Header {
		for _, v := range value {
			w.Header().Add(key, v)
		}
	}
	status := rs.StatusCode
	w.WriteHeader(status)
	io.Copy(w, rs.Body)
}

func (pri *ProxyUrl) Handler(w http.ResponseWriter, req *http.Request) {
	url := pri.Server
	url += pri.GetPath(req)
	Debug("ProxyUrl.Handler %s %s to %s", req.Method, req.URL, url)
	outReq, _ := http.NewRequest(req.Method, url, req.Body)
	for key, value := range req.Header {
		for _, v := range value {
			outReq.Header.Add(key, v)
		}
		Print("ProxyUrl.Handler %s: %s", key, value)
	}
	Debug("ProxyUrl.Handler %s", pri.Auth)
	if pri.Auth.Type == "basic" {
		outReq.SetBasicAuth(pri.Auth.Username, pri.Auth.Password)
	}
	pri.ServeHttp(w, outReq)
}

type ProxyWs struct {
	Proxy
}

func (pri *ProxyWs) Dial(url_, protocol, origin string) (ws *websocket.Conn, err error) {
	config, err := websocket.NewConfig(url_, origin)
	if err != nil {
		return nil, err
	}
	if protocol != "" {
		config.Protocol = []string{protocol}
	}
	config.TlsConfig = pri.TlsConfig

	return websocket.DialConfig(config)
}

func (pri *ProxyWs) Socket(ws *websocket.Conn) {
	defer ws.Close()
	ws.PayloadType = websocket.BinaryFrame

	req := ws.Request()
	schema := "ws"
	if pri.Url.Scheme == "https" {
		schema = "wss"
	}
	target := schema + "://" + pri.Url.Host + pri.GetPath(req)
	conn, err := pri.Dial(target, "", req.URL.RequestURI())
	if err != nil {
		Error("ProxyWs.Socket dial %s", err)
		return
	}
	defer conn.Close()
	Debug("ProxyWs.Socket request by %s", ws.RemoteAddr())
	Debug("ProxyWs.Socket connect to %s", conn.RemoteAddr())

	wait := sync.WaitGroup{}
	wait.Add(2)
	go func() {
		defer wait.Done()
		if _, err := io.Copy(conn, ws); err != nil {
			Error("ProxyWs.Socket copy from ws %s", err)
		}
	}()
	go func() {
		defer wait.Done()
		if _, err := io.Copy(ws, conn); err != nil {
			Error("ProxyWs.Socket copy from target %s", err)
		}
	}()
	wait.Wait()
}