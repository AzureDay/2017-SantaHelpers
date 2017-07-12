### Install global dependencies

```bash
npm install --global electron
```

### Install local dependencies

```bash
npm install
```

### Provide configuration

Open `./config.json` file and set those properties:

|Name|Meaning|Example|
|----|-------|-------|
|`apiHost`|URL of Azure Function host where Dashboard API is located|`https://speaker-dashboard.azurewebsites.net`|



### Run

```bash
npm start
```