function Personne(revenusNus, revenusMeuble, nbPart) {
  this.revenusNus = revenusNus;
  this.revenusMeuble = revenusMeuble;
  this.nbPart = nbPart;
  this.revenusTotal = this.calcRevenusTotal(
    this.revenusNus,
    this.revenusMeuble
  );
  this.revenusMensuelAvantImpot = this.calcRevenusMensuelAvantImpot();

  this.impots = [
    { nom: "Taxe foncière Raismes", montant: 600 },
    { nom: "Taxe foncière Roubaix", montant: 400 },
    { nom: "Taxe foncière St Amand", montant: 400 }
  ];
  this.calcImpotFoncier(this.revenusNus);
  this.calcImpotFoncier(this.revenusMeuble, true);
  this.calcImpotRevenus(this.revenusTotal, this.nbPart);
  this.impotTotal = this.calcImpotTotal();
  this.revenusMensuelApresImpots = this.calcRevenusMensuelApresImpots();
}
Personne.prototype.calcRevenusTotal = function() {
  return this.revenusNus + this.revenusMeuble;
};
Personne.prototype.calcRevenusMensuelAvantImpot = function() {
  return this.revenusTotal / 12;
};

Personne.prototype.calcImpotFoncier = function(revenus, meuble = false) {
  let nom, baseImposable;
  if (meuble) {
    nom = "Impot revenus meublés";
    baseImposable = revenus * 0.5;
  } else {
    nom = "Impot revenus nus";
    baseImposable = revenus * 0.7;
  }
  // CSG, CRDS, PREL SOC CONT ADD, PREL SOL
  this.impots.push({
    nom: nom,
    montant: baseImposable * 0.7 * (0.099 + 0.005 + 0.048 + 0.02)
  });
};
Personne.prototype.calcImpotRevenus = function(revenus, nbPart) {
  // Etape 1 : diviser son revenu imposable par le nombre de parts
  const tmp = revenus / nbPart;
  let impotRevenu = 0;
  // Etape 2 : appliquer à chaque tranche son taux d'imposition
  tranches = [
    { min: 0, max: 9964, taux: 0 },
    { min: 9965, max: 27519, taux: 0.14 },
    { min: 27520, max: 73779, taux: 0.3 },
    { min: 73780, max: 156244, taux: 0.41 }
  ];
  for (let i = 0; i < tranches.length; i++) {
    const tranche = tranches[i];
    let max;
    if (tranche.max > tmp) {
      max = tmp;
      impotRevenu += (max - tranche.min) * tranche.taux;
      break;
    } else {
      max = tranche.max;
    }
    impotRevenu += (max - tranche.min) * tranche.taux;
  }
  // Etape 3 : additionner les impositions et multiplier le total par le nombre de parts
  this.impots.push({
    nom: "Impot revenus",
    montant: impotRevenu * nbPart
  });
};
Personne.prototype.calcImpotTotal = function() {
  let impotTotal = 0;
  this.impots.forEach(impot => {
    impotTotal += impot.montant;
  });
  return impotTotal;
};
Personne.prototype.calcRevenusMensuelApresImpots = function() {
  return (this.revenusTotal - this.impotTotal) / 12;
};

const gabriel = new Personne((550 + 410) * 12, 300 * 3 * 12, 1.5);
console.log(gabriel);
