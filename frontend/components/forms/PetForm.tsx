import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { PetCreateProps } from "@/api/petService";
import DateTimePicker from "@react-native-community/datetimepicker";

type PetFormProps = {
  initialValues?: PetCreateProps;
  mutation: any;
  isEditing?: boolean;
};

const PetForm = ({ initialValues, mutation, isEditing }: PetFormProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || "",
    species: initialValues?.species || "",
    breed: initialValues?.breed || "",
    description: initialValues?.description || "",
    date_of_birth: initialValues ? new Date(initialValues?.date_of_birth) : new Date(),
    ...(!isEditing ? {} : { weight: initialValues?.weight || "" }),
  });

  const handleSubmit = async () => {
    const parsedDateOfBrith = formValues.date_of_birth.toISOString().split("T")[0];

    const payload = {
      ...formValues,
      date_of_birth: parsedDateOfBrith,
    };

    mutation.mutate(payload);
  };

  return (
    <View style={{ gap: 8 }}>
      <InputField
        onChangeText={(name) => setFormValues({ ...formValues, name })}
        value={formValues.name}
        autoFocus={true}
        placeholder='Imię'
        error={mutation.error?.message.name}
      />
      <InputField
        onChangeText={(species) => setFormValues({ ...formValues, species })}
        value={formValues.species}
        autoFocus={false}
        placeholder='Gatunek'
        error={mutation.error?.message.species}
      />
      <InputField
        onChangeText={(breed) => setFormValues({ ...formValues, breed })}
        value={formValues.breed}
        autoFocus={false}
        placeholder='Rasa'
        error={mutation.error?.message.breed}
      />
      <InputField
        onChangeText={(description) => setFormValues({ ...formValues, description })}
        value={formValues.description}
        autoFocus={false}
        placeholder='Opis'
        maxLength={100}
        multiline
        error={mutation.error?.message.description}
      />
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <InputField
          value={formValues.date_of_birth.toLocaleDateString()}
          autoFocus={false}
          placeholder='Wiek'
          editable={false}
          error={mutation.error?.message.date_of_birth}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={formValues.date_of_birth}
          mode='date'
          display='default'
          onChange={({ type }, selectedDate) => {
            setShowPicker(false);
            if (type === "set" && selectedDate) {
              setFormValues({ ...formValues, date_of_birth: selectedDate });
            }
          }}
        />
      )}
      {!isEditing && (
        <InputField
          onChangeText={(weight) => setFormValues({ ...formValues, weight })}
          value={formValues.weight || ""}
          autoFocus={false}
          keyboardType='numeric'
          placeholder='Waga'
          error={mutation.error?.message.weight}
        />
      )}
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        {isEditing ? "Zapisz" : "Utwórz"}
      </Button>
    </View>
  );
};

export default PetForm;
