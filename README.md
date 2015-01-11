# 環境構築

Python: 2.7.9
Django: 1.7.2

## Pythonz 

```
sudo su -
apt-get install build-essential zlib1g-dev libbz2-dev libssl-dev libreadline-dev libncurses5-dev libsqlite3-dev libgdbm-dev libdb-dev libexpat-dev libpcap-dev liblzma-dev libpcre3-dev
curl -kLO https://raw.github.com/saghul/pythonz/master/pythonz-install
chmod +x pythonz-install
./pythonz-install
echo '  [[ -s /usr/local/pythonz/etc/bashrc ]] && source /usr/local/pythonz/etc/bashrc' >> ~/.bashrc
. .bashrc
pythonz install 2.7.9
```


##Virtualenv

```
sudo apt-get install python-virtualenv virtualenvwrapper
```

```
mkvirtualenv -p /usr/local/pythonz/pythons/CPython-2.7.9/bin/python2.7 --distribute yoshikawa_alarm
workon yoshikawa_alarm
```
