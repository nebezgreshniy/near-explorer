import { getNearNetwork } from "../../libraries/config";
import { ExplorerApi } from "../../libraries/explorer-wamp";

export default async function (req, res) {
  // This API is currently providing computed estimation based on the inflation, so we only have it for mainnet
  const nearNetwork = getNearNetwork(req.headers.host);
  if (nearNetwork.name !== "mainnet") {
    res.status(404).end();
    return;
  }

  try {
    const supply = await new ExplorerApi(req).call(
      "get-latest-circulating-supply"
    );
    const supplyInYoctoNEAR = supply.circulating_supply_in_yoctonear;
    res.send(supplyInYoctoNEAR.substr(0, supplyInYoctoNEAR.length - 24));
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
