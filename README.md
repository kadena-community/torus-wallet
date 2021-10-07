# Torus Wallet
Torus Wallet is a web DEX wallet.

With the simplicity of login through Google, it allows you to create and keep track of a Torus Wallet account.<br />
You will be able to easily create your own and secure account, manage your assets by checking your balance, top up or transfer funds to different accounts and chains.
## How to run Torus Wallet locally
In the directory where you want to place your project, you can run:
```sh
git clone https://github.com/kadena-community/torus-wallet.git
cd torus-wallet
```
Once Torus Wallet has been cloned, you will need to create a `.env` file in the project directory.<br />
An example file `env.example` is already present in the project in order to guide you in the creation of the `.env` file, copy and paste its content and remove the brackets by adding the proper keys.
After the correct creation of the `.env` file, you can run:
```sh
npm install
npm start
```
Then open [http://localhost:3000/](http://localhost:3000/) to see the app in the browser.<br>
## More Info
You can find detailed instructions on how to get your own Torus Verifier and Google Client ID in [Torus Documentation](https://docs.tor.us/) and [Google Cloud Platform](https://console.cloud.google.com).
