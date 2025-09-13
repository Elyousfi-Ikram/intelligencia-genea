import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Location {
    id: number;
    city: string;
    address: string;
    phone: string;
    displayPhone: string;
    isHeadquarters?: boolean;
    hasSecretariat?: boolean;
    mapPosition: { x: number; y: number };
}

@Component({
    selector: 'app-reseau',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reseau.component.html',
    styleUrls: ['./reseau.component.scss']
})
export class ReseauComponent {
    selectedLocation: Location | null = null;

    locations: Location[] = [
        {
            id: 1,
            city: "Aix en Provence",
            address: "11 Rue du RICM, 13100 Aix en Provence",
            phone: "+33645820697",
            displayPhone: "06 45 82 06 97",
            isHeadquarters: true,
            mapPosition: { x: 73.55, y: 72.55 }
        },
        {
            id: 2,
            city: "Aix-en-Provence",
            address: "67 Cours Mirabeau, 13100 Aix-en-Provence",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            hasSecretariat: true,
            mapPosition: { x: 73.55, y: 72.55 }
        },
        {
            id: 16,
            city: "Ajaccio",
            address: "Route Sanguinaires, 20000 Ajaccio",
            phone: "+33607257427",
            displayPhone: "06 45 82 06 97",
            mapPosition: { x: 89.4, y: 85.2 }
        },
        {
            id: 17,
            city: "Bastia",
            address: "12 Quai des Martyrs de la Libération, 20200 Bastia",
            phone: "+33607257427",
            displayPhone: "06 45 82 06 97",
            mapPosition: { x: 93.5, y: 77.95 }
        },
        {
            id: 10,
            city: "Biarritz",
            address: "Rue du Régina, 64200 Biarritz",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 27.45, y: 72 }
        },
        {
            id: 15,
            city: "Bordeaux",
            address: "Rue François de Sourdis, 33000 Bordeaux",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 33, y: 61 }
        },
        {
            id: 5,
            city: "Cannes",
            address: "29 Avenue des Hespérides, 06400 Cannes",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 81.4, y: 72.7 }
        },
        {
            id: 12,
            city: "Le Havre",
            address: "333 Rue Félix Faure, 76620 Le Havre",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 39, y: 19.6 }
        },
        {
            id: 14,
            city: "Le Vésinet",
            address: "Rue Pierre Curie, 78110 Le Vésinet",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 50.85, y: 24.95 }
        },
        {
            id: 3,
            city: "Marseille",
            address: "8 Boulevard des Frères Godchot, 13005 Marseille",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 72, y: 75.15 }
        },
        {
            id: 11,
            city: "Nantes",
            address: "5 Rue Le Nôtre, 44000 Nantes",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 29.05, y: 39.7 }
        },
        {
            id: 4,
            city: "Nice",
            address: "ABC Sud Intelligence, 6 av Henri Barbusse, 06200 Nice",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 83.4, y: 70.7 }
        },
        {
            id: 7,
            city: "Pierrevert",
            address: "L'Orée du Golf, 04860 Pierrevert",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 76, y: 70 }
        },
        {
            id: 18,
            city: "Reims",
            address: "32 Boulevard de la Paix, 51100 Reims",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 62.45, y: 21.55 }
        },
        {
            id: 9,
            city: "Rennes",
            address: "63 Rue de Robien, 35000 Rennes",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 27, y: 30.9 }
        },
        {
            id: 13,
            city: "Roquebrune-Cap-Martin",
            address: "Avenue Bellevue, 06190 Roquebrune-Cap-Martin",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 85, y: 69 }
        },
        {
            id: 6,
            city: "Saint-Tropez",
            address: "Boulevard Louis Blanc, 83990 Saint-Tropez",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 79, y: 74.5 }
        },
        {
            id: 8,
            city: "Tours",
            address: "6 Rue Victor Laloux, 37000 Tours",
            phone: "+33607257427",
            displayPhone: "06 07 25 74 27",
            mapPosition: { x: 43.4, y: 36.9 }
        }
    ];

    handlePointClick(location: Location): void {
        this.selectedLocation = location;
        const locationCard = document.getElementById(`location-${location.id}`);
        if (locationCard) {
            locationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    trackByLocationId(index: number, location: Location): number {
        return location.id;
    }
}