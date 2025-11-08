"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import {
   AirVent,
   Armchair,
   Bath,
   BedDouble,
   ClipboardList,
   Flame,
   Home,
   Hotel,
   Info,
   Layers,
   MapPin,
   Ruler,
   Settings,
   SquareParking,
   TrafficCone,
} from "lucide-react";

// ------------------------
// TypeScript type
// ------------------------
type HouseData = {
   area: number;
   bedrooms: number;
   bathrooms: number;
   stories: number;
   parking: number;
   mainroad: "yes" | "no";
   guestroom: "yes" | "no";
   basement: "yes" | "no";
   hotwaterheating: "yes" | "no";
   airconditioning: "yes" | "no";
   prefarea: "yes" | "no";
   furnishingstatus: "furnished" | "semi-furnished" | "unfurnished";
};

export default function HouseForm() {
   const [formData, setFormData] = useState<HouseData>({
      area: 30,
      bedrooms: 3,
      bathrooms: 2,
      stories: 2,
      parking: 1,
      mainroad: "yes",
      guestroom: "no",
      basement: "yes",
      hotwaterheating: "no",
      airconditioning: "yes",
      prefarea: "no",
      furnishingstatus: "semi-furnished",
   });

   const [result, setResult] = useState<string | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const handleChange = <K extends keyof HouseData>(
      key: K,
      value: HouseData[K],
   ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
   };

   const submitHouseData = async (formData: HouseData) => {
      try {
         const response = await fetch(apiUrl!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
         });
         if (!response.ok)
            throw new Error(`Erreur HTTP ! Status: ${response.status}`);

         const data = await response.json();

         if (data && data.prediction !== undefined) {
            // Arrondi à la dizaine de milliers et format français
            const roundedPrice = Math.round(data.prediction / 10000) * 10000;
            const formattedPrice = roundedPrice.toLocaleString("fr-FR");

            setResult(`Le prix sera d'environ ${formattedPrice} MAD`);
            setIsDialogOpen(true);
         }
         return data;
      } catch (err) {
         console.error("Erreur lors de l'appel à l'API:", err);
         setResult("Une erreur est survenue lors de la prédiction.");
         setIsDialogOpen(true);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submitHouseData(formData);
   };

   return (
      <div className="flex flex-col lg:flex-row gap-6">
         {/* Carte d'intro */}
         <div
            className="max-w-sm flex items-center gap-4 p-4 shadow-lg text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/Casablanca.jpeg')" }}
         >
            <div className="bg-white rounded-full p-2 flex items-center justify-center">
               <Home className="w-6 h-6 text-[#2761EA]" />
            </div>
            <div>
               <h3 className="text-4xl font-extrabold text-white">
                  Prédicteur de prix immobilier au Maroc
               </h3>
            </div>
         </div>

         {/* Formulaire */}
         <Card className="max-w-2xl mx-auto overflow-hidden pt-0 mt-10">
            <CardHeader className="bg-gradient-to-r from-[#2761EA] to-[#3F30FF] text-white w-full h-full pt-6 pb-4">
               <CardTitle className="flex flex-row gap-2 items-center">
                  <ClipboardList />
                  <span className="text-2xl">Détails du bien immobilier</span>
               </CardTitle>
               <p>
                  Saisissez les informations de votre bien immobilier ci-dessous pour
                  obtenir une estimation de sa valeur sur le marché.
               </p>
            </CardHeader>

            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bloc : Informations de base */}
                  <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-500">
                        <Info className="w-6 h-6" /> Informations de base
                     </h2>
                     <div className="flex flex-wrap gap-10">
                        <div className=" min-w-[200px]">
                           <label className="flex items-center gap-1 text-gray-600">
                              <Ruler className="w-5 h-5" /> Surface (m²)
                           </label>
                           <select
                              value={formData.area}
                              onChange={(e) =>
                                 handleChange("area", Number(e.target.value))
                              }
                              className="py-2 px-3 rounded-lg border border-gray-300 mt-2 w-full"
                           >
                              <option value="">Saisir surface(m²)</option>
                              <option value={30}>0 - 30 m²</option>
                              <option value={60}>31 - 60 m²</option>
                              <option value={90}>61 - 90 m²</option>
                              <option value={120}>91 - 120 m²</option>
                              <option value={150}>121 - 150 m²</option>
                              <option value={200}>151 - 200 m²</option>
                              <option value={250}>201 - 250 m²</option>
                              <option value={300}>251 - 300 m²</option>
                              <option value={400}>301 - 400 m²</option>
                              <option value={500}>401 m² and above</option>
                           </select>
                        </div>

                        <div className=" min-w-[150px]">
                           <label className="flex items-center gap-1 text-gray-600">
                              <BedDouble className="w-5 h-5" /> Nombre de chambres
                           </label>
                           <Input
                              type="number"
                              value={formData.bedrooms}
                              onChange={(e) =>
                                 handleChange("bedrooms", Number(e.target.value))
                              }
                              className="py-2 px-3 rounded-lg border border-gray-300 mt-2"
                           />
                        </div>

                        <div className=" min-w-[150px]">
                           <label className="flex items-center gap-1 text-gray-600">
                              <Bath className="w-5 h-5" /> Nombre de salles de bain
                           </label>
                           <Input
                              type="number"
                              value={formData.bathrooms}
                              onChange={(e) =>
                                 handleChange("bathrooms", Number(e.target.value))
                              }
                              className="py-2 px-3 rounded-lg border border-gray-300 mt-2"
                           />
                        </div>

                        <div className=" min-w-[150px]">
                           <label className="flex items-center gap-1 text-gray-600">
                              <Layers className="w-5 h-5" /> Nombre d&apos;étages
                           </label>
                           <Input
                              type="number"
                              value={formData.stories}
                              onChange={(e) =>
                                 handleChange("stories", Number(e.target.value))
                              }
                              className="py-2 px-3 rounded-lg border border-gray-300 mt-2"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Bloc : Détails de localisation */}
                  <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-500">
                        <MapPin className="w-6 h-6" /> Détails de localisation
                     </h2>
                     <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <TrafficCone className="w-5 h-5" /> Route principale
                           </label>
                           <Select
                              value={formData.mainroad}
                              onValueChange={(value) =>
                                 handleChange("mainroad", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <Hotel className="w-5 h-5" /> Zone privilégiée
                           </label>
                           <Select
                              value={formData.prefarea}
                              onValueChange={(value) =>
                                 handleChange("prefarea", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <SquareParking className="w-5 h-5" /> Places de parking
                           </label>
                           <Input
                              type="number"
                              min={0}
                              max={10}
                              value={formData.parking}
                              onChange={(e) => {
                                 let value = Number(e.target.value);
                                 if (value < 0) value = 0;
                                 if (value > 10) value = 10;
                                 handleChange("parking", value);
                              }}
                              className="py-2 px-3 rounded-lg border border-gray-300"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Bloc : Caractéristiques du bien */}
                  <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-500">
                        <Settings className="w-6 h-6" /> Caractéristiques du bien
                     </h2>
                     <div className="flex flex-wrap gap-4">
                        <div className="min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <Flame className="w-5 h-5" /> Chauffe-eau
                           </label>
                           <Select
                              value={formData.hotwaterheating}
                              onValueChange={(value) =>
                                 handleChange("hotwaterheating", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <AirVent className="w-5 h-5" /> Climatisation
                           </label>
                           <Select
                              value={formData.airconditioning}
                              onValueChange={(value) =>
                                 handleChange("airconditioning", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <BedDouble className="w-5 h-5" /> Chambre d&apos;amis
                           </label>
                           <Select
                              value={formData.guestroom}
                              onValueChange={(value) =>
                                 handleChange("guestroom", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <Hotel className="w-5 h-5" /> Sous-sol
                           </label>
                           <Select
                              value={formData.basement}
                              onValueChange={(value) =>
                                 handleChange("basement", value as "yes" | "no")
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner une option" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="yes">Oui</SelectItem>
                                 <SelectItem value="no">Non</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="min-w-[150px]">
                           <label className="flex items-center gap-1 mb-1 text-gray-600">
                              <Armchair className="w-5 h-5" /> État du mobilier
                           </label>
                           <Select
                              value={formData.furnishingstatus}
                              onValueChange={(value) =>
                                 handleChange(
                                    "furnishingstatus",
                                    value as "unfurnished" | "semi-furnished" | "furnished",
                                 )
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Sélectionner le mobilier" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="unfurnished">Non meublé</SelectItem>
                                 <SelectItem value="semi-furnished">
                                    Semi-meublé
                                 </SelectItem>
                                 <SelectItem value="furnished">Meublé</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </div>

                  <Button
                     type="submit"
                     className="mt-6 w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#2761EA] to-[#3F30FF] rounded-xl shadow-lg hover:from-[#3F30FF] hover:to-[#2761EA] transition-colors duration-300"
                  >
                     Voir Estimation
                  </Button>
               </form>
            </CardContent>
         </Card>

         {/* Dialog shadcn */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
               <DialogHeader>
                  <DialogTitle>Résultat de l&apos;estimation</DialogTitle>
               </DialogHeader>
               <p className="text-lg mt-2">{result}</p>
               <DialogFooter>
                  <Button
                     onClick={() => setIsDialogOpen(false)}
                     className="w-full bg-gradient-to-r from-[#2761EA] to-[#3F30FF] text-white"
                  >
                     Fermer
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
