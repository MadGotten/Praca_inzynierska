from rest_framework import permissions
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from family.models import Family
from members.models import FamilyMember
from pets.models import Pet, PetRecord
from invites.models import FamilyInvitation


class Membership(permissions.BasePermission):
    def check_ownership(self, family_id, user_id):
        if not Family.objects.filter(id=family_id, owner_id=user_id).exists():
            raise NotFound(detail="No Family matches the given query.")

    def check_membership(self, family_id, user_id):
        if not FamilyMember.objects.filter(
            family_id=family_id, user_id=user_id
        ).exists():
            raise NotFound(detail="No Family matches the given query.")

    def get_membership(self, family_id, user_id):
        membership = FamilyMember.objects.filter(
            family_id=family_id, user_id=user_id
        ).first()
        if not membership:
            raise NotFound(detail="No Family matches the given query.")
        return membership


class IsFamilyOwner(Membership):
    """Allows family owners to perform action on their family."""

    def has_permission(self, request, view):
        if view.action == "create":
            family_id = view.kwargs.get("family_id")
            if family_id is None:
                return False
            self.check_ownership(family_id, request.user.id)

        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Family):
            return obj.owner_id == request.user.id

        if isinstance(obj, (FamilyMember, FamilyInvitation, Pet)):
            return obj.family.owner_id == request.user.id

        return False


class IsFamilyAdmin(Membership):
    message = "Nie posiadasz uprawnień administratora dla tej rodziny."

    def has_permission(self, request, view):
        if view.action == "create":
            family_id = view.kwargs.get("family_id")
            pet_id = view.kwargs.get("pet_id")

            if family_id:
                membership = self.get_membership(family_id, request.user.id)
                if membership.role <= 2:
                    return True
            elif pet_id:
                pet = get_object_or_404(Pet, pk=pet_id)
                membership = self.get_membership(pet.family_id, request.user.id)
                if membership.role <= 2:
                    return True

            return False

        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Family):
            membership = self.get_membership(obj.id, request.user.id)
            if membership.role <= 2:
                return True

        if isinstance(obj, (FamilyMember, FamilyInvitation, Pet)):
            membership = self.get_membership(obj.family_id, request.user.id)
            if membership.role <= 2:
                return True

        if isinstance(obj, PetRecord):
            membership = self.get_membership(obj.pet.family_id, request.user.id)
            if membership.role <= 2:
                return True

        return False


class IsFamilyMember(Membership):
    def has_permission(self, request, view):
        if view.action == "list":
            family_id = view.kwargs.get("family_id")
            pet_id = view.kwargs.get("pet_id")

            if family_id:
                self.check_membership(family_id, request.user.id)
                return True
            elif pet_id:
                pet = get_object_or_404(Pet, pk=pet_id)
                self.check_membership(pet.family_id, request.user.id)
                return True

            return False

        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Family):
            self.check_membership(obj.id, request.user.id)
            return True

        if isinstance(obj, (FamilyMember, FamilyInvitation, Pet)):
            self.check_membership(obj.family_id, request.user.id)
            return True

        if isinstance(obj, PetRecord):
            self.check_membership(obj.pet.family_id, request.user.id)
            return True
        return False
