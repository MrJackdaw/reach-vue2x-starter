"reach 0.1";

export const main = Reach.App(() => {
  const Buyer = ParticipantClass("Buyer", { showSuccessMsg: Fun([], Null) });
  const Creator = Participant("Creator", {});
  const Seller = Participant("Seller", {
    amount: UInt,
    token: Token,
    price: UInt,
    creator: Address,
    arbitrator: Array(Address, 2),
  });
  deploy();

  // Your Application here
  Seller.only(() => {
    const amt = declassify(interact.amount);
    const arbitrators = declassify(interact.arbitrator);
    const creator = declassify(interact.creator);
    const price = declassify(interact.price);
    const token = declassify(interact.token);
    assume(amt > 0, "invalid payment amt");
  });
  Seller.publish(amt, token, creator, arbitrators, price).pay([[amt, token]]);
  Creator.set(creator);
  require(balance(token) == amt);
  commit();

  Buyer.publish().pay(price);
  transfer(amt, token).to(this);
  Buyer.interact.showSuccessMsg();

  const royalty = balance() * (15 / 100);  
  const appFee = (balance() * (2 / 100)) / 2;
  
  transfer(royalty).to(Creator);
  Array.forEach(arbitrators, (a) => {
    transfer(appFee).to(a);
  });
  commit();

  closeTo(Seller);
});
