async function commonProviderDetector(_provider) {
    if(_provider == "metamask_wallet"){
        if(window.ethereum && window.ethereum.providers){
            const metamaskProvider = window.ethereum.providers.find(
                (provider) => provider.isMetaMask
            )

            if(metamaskProvider) {
                window.ethereum.providers = [metamaskProvider];

                return await commonInjectedConnect(metamaskProvider, _provider);
            }else {
                console.log("metamask wallet not found")

                windows.open("https://metamask.io/download/", "_blank").focus();

                return false;
            }
        } else if(window.ethereum) {
            return await commonInjectedConnect(window.ethereum, _provider);
        }else {
            console.log("metamask wallet not found");

            try {
                windows.open("https://metamask.io/download", "_blank").focus()
            }catch(error) {}

            return false;
        }
    }
}

async function commonInjectedConnect(_provider, _provider_name) {
    await _provider.enable();

    setWeb3Events(_provider);

    web3 = new Web3(_provider);
    
    let currentNetworkId = await web3.eth.getChainId();
    currentNetworkId = currentNetworkId.toString();
    console.log("network", currentNetworkId);

    let accounts = await web3.eth.getAccounts();

    console.log("-> accounts");
    console.log(accounts)

    currentAddress = accounts[0].toLowerCase();

    if(currentNetworkId != _NETWORK_ID) {
        notyf.error(
            `Please connect Wallet on ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`
        );
        return false
    }

    oContractToken = new web3.eth.Contract(
        SELECT_CONTRACT[_NETWORK_ID].TOKEN.abi,
        SELECT_CONTRACT[_NETWORK_ID].TOKEN.address
    )

    return true;
}

function setWeb3Events(_provider){
    _provider.on("accountsChanged", (accounts) => {
        console.log(accounts);

        if(!accounts.length) {
            logout();
        }else {
            currentAddress = accounts[0];
            let sClass = getSelectedTab();
        }
    });


    // Subscribe to chainId change
    _provider.on("chainChanged", (chainId) => {
        console.log(chainId)
        logout()
    });

    // Subscribe to session connection
    _provider.on("connect", () => {
        console.log("connect")
        logout()
    });

    // Subscribe to session disconnection
    _provider.on("disconnect", (code, reason) => {
        console.log(code, reason)
        localStorage.clear();
        logout()
    });
}

function logout() {
    window.location.reload();
}

function addDecimal(num, nDec) {
    const aNum = `${num}`.split(".")

    if(aNum[1]) {
        if(aNum[1].length > nDec) aNum[1] = aNum[1].slice(0, nDec);
        return aNum[0] + aNum[1] + "0".repeat(nDec - aNum[1].length);
    }
    return aNum[0] + "0".repeat(nDec);
}

function formatEthErrorMsg(error) {
    try{
        var eFrom = error.message.indexOf("{")
        var eTo = error.message.indexOf("}")
        var eM1 = error.message.indexOf("TokenStaking: ");
        var eM2 = error.message.indexOf("ERC20 :");
        var eM4 = error.message.indexOf("Internal JSON-RPC error");

        if(eFrom != -1 && eTo != -1 && (eM1 != -1 || eM2 != -1)) {
            var eMsgTemp = JSON.parse(error.message.substr(eFrom, eTo));
            var eMsg = eM4 != -1 ? eMsgTemp.message : eMsgTemp.originalError.message;

            if(eM1 != -1) {
                return eMsg.split("TokenStaking: ")[1];
            }else {
                return eMsg.split("ERC20 : ")[1];
            }
        } else {
            return error.message;
        } 
    }catch(e){
        console.log(e);
        return "Something Went Wrong!"
    }
}

function getSelectedTab(sClass) {
    console.log(sClass)
    return sClass || contractCall;
}

function getContractObj(sClass) {
    return new web3.eth.Contract(
        SELECT_CONTRACT[_NETWORK_ID].STACKING.abi,
        SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address
    )
}