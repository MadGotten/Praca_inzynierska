import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import FamilySheet from "@/components/sheets/FamilySheet";
import PetsListSheet from "@/components/sheets/PetsListSheet";
import MembersListSheet from "@/components/sheets/MembersListSheet";
import PetsDetailSheet from "@/components/sheets/PetsDetailSheet";
import DetailsListSheet from "@/components/sheets/DetailsListSheet";

registerSheet("family-sheet", FamilySheet);
registerSheet("petslist-sheet", PetsListSheet);
registerSheet("memberslist-sheet", MembersListSheet);
registerSheet("petsdetail-sheet", PetsDetailSheet);
registerSheet("detailslist-sheet", DetailsListSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "family-sheet": SheetDefinition<{
      payload: {
        familyId: number;
      };
    }>;
    "petslist-sheet": SheetDefinition<{
      payload: {
        familyId: number;
      };
    }>;
    "memberslist-sheet": SheetDefinition<{
      payload: {
        familyId: number;
      };
    }>;
    "petsdetail-sheet": SheetDefinition<{
      payload: {
        petId: number;
      };
    }>;
    "detailslist-sheet": SheetDefinition<{
      payload: {
        petId: number;
      };
    }>;
  }
}

export {};
