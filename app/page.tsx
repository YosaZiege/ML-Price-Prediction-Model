"use client";

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
import * as React from "react";
import { useState } from "react";

export default function HouseForm() {
   const [formData, setFormData] = useState({
      area: 6000,
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
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const handleChange = (key: string, value: any) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
   };

   async function submitHouseData(formData: any) {
      try {
         const response = await fetch(apiUrl!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
         });

         if (!response.ok) {
            throw new Error(`Erreur HTTP ! Status: ${response.status}`);
         }

         const data = await response.json();
         console.log("Prédiction:", data);

         if (data && data.prediction !== undefined) {
            const roundedPrice = Math.round(data.prediction);
            setResult(`Le prix sera d'environ ${roundedPrice} MAD`);
         }

         return data;
      } catch (err) {
         console.error("Erreur lors de l'appel à l'API:", err);
         setResult("Une erreur est survenue lors de la prédiction.");
      }
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submitHouseData(formData);
   };

   return (
      <Card className="max-w-xl mx-auto mt-10">
         <CardHeader>
            <CardTitle>Formulaire des Détails de la Maison</CardTitle>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Numeric Inputs */}
               {[
                  ["area", "Surface (m²)"],
                  ["bedrooms", "Chambres"],
                  ["bathrooms", "Salles de bain"],
                  ["stories", "Nombre d'étages"],
                  ["parking", "Places de parking"],
               ].map(([key, label]) => (
                  <div key={key as string}>
                     <label className="block mb-1">{label}</label>
                     <Input
                        type="number"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) =>
                           handleChange(key as string, Number(e.target.value))
                        }
                     />
                  </div>
               ))}

               {/* Yes/No Select Inputs */}
               {[
                  ["mainroad", "Route principale"],
                  ["guestroom", "Chambre d'amis"],
                  ["basement", "Sous-sol"],
                  ["hotwaterheating", "Chauffe-eau"],
                  ["airconditioning", "Climatisation"],
                  ["prefarea", "Zone privilégiée"],
               ].map(([key, label]) => (
                  <div key={key as string}>
                     <label className="block mb-1">{label}</label>
                     <Select
                        value={formData[key as keyof typeof formData]}
                        onValueChange={(value) => handleChange(key as string, value)}
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
               ))}

               {/* Furnishing Status */}
               <div>
                  <label className="block mb-1">État du mobilier</label>
                  <Select
                     value={formData.furnishingstatus}
                     onValueChange={(value) => handleChange("furnishingstatus", value)}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le mobilier" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="unfurnished">Non meublé</SelectItem>
                        <SelectItem value="semi-furnished">Semi-meublé</SelectItem>
                        <SelectItem value="furnished">Meublé</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <Button type="submit" className="mt-4">
                  Soumettre
               </Button>
            </form>

            {/* Display API result */}
            {result && (
               <pre className="mt-6 p-4 bg-gray-100 rounded text-sm">{result}</pre>
            )}
         </CardContent>
      </Card>
   );
}
