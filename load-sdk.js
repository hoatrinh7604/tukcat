const plugin = new UnityTonPlugin.default({
  manifestUrl:
    "https://catb.io/tonconnect-manifest.json",
    onWalletConnected: () => {
		if(unityInstanceRef != null)
		{
			unityInstanceRef.SendMessage("GameElement", "OnWalletConnectSuccess", plugin.getAccount()); 
		}
    }
});
