import { View } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { NoteProps } from "@/api/details/noteService";

type NoteFormProps = {
  initialValues?: NoteProps;
  mutation: any;
};

const NoteForm = ({ initialValues, mutation }: NoteFormProps) => {
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
  });

  const handleSubmit = async () => {
    mutation.mutate(formValues);
  };

  return (
    <View style={{ gap: 8 }}>
      <InputField
        onChangeText={(name) => setFormValues({ ...formValues, name })}
        value={formValues.name}
        autoFocus={true}
        placeholder='Nazwa'
        error={mutation.error?.message.name}
      />
      <InputField
        onChangeText={(description) => setFormValues({ ...formValues, description })}
        value={formValues.description}
        multiline
        maxLength={500}
        autoFocus={false}
        placeholder='Opis'
        error={mutation.error?.message.description}
      />
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        {initialValues ? "Zapisz" : "Utwórz"}
      </Button>
    </View>
  );
};

export default NoteForm;
