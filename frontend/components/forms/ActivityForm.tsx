import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TimerPickerModal } from "react-native-timer-picker";
import { ActivityProps } from "@/api/details/activityService";

type ActivityFormProps = {
  initialValues?: ActivityProps;
  mutation: any;
};

const ActivityForm = ({ initialValues, mutation }: ActivityFormProps) => {
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || "",
    duration: initialValues?.duration || "",
    date: initialValues?.date ? new Date(initialValues.date) : new Date(),
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  const formatInputTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return {
      hours,
      minutes,
      seconds,
    };
  };

  const formatTime = ({
    hours,
    minutes,
    seconds,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const timeParts = [];

    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
      timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
  };

  const handleSubmit = async () => {
    let date = new Date(formValues.date);

    if (!isNaN(date.getTime())) {
      const payload = {
        ...formValues,
        date: date.toISOString().split("T")[0],
      };

      mutation.mutate(payload);
    }
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
      <TouchableOpacity onPress={() => setShowTimerPicker(true)}>
        <InputField
          onChangeText={(duration) => setFormValues({ ...formValues, duration })}
          value={formValues.duration}
          autoFocus={false}
          placeholder='Czas aktywności'
          editable={false}
          error={mutation.error?.message.duration}
        />
      </TouchableOpacity>
      <TimerPickerModal
        visible={showTimerPicker}
        initialValue={formValues.duration && formatInputTime(formValues.duration)}
        setIsVisible={setShowTimerPicker}
        onConfirm={(pickedDuration) => {
          setFormValues({ ...formValues, duration: formatTime(pickedDuration) });
          setShowTimerPicker(false);
        }}
        modalTitle='Ustaw czas aktywności'
        confirmButtonText='Ustaw'
        cancelButtonText='Anuluj'
        styles={{
          confirmButton: { borderColor: "#FFC043", color: "black", backgroundColor: "#FFC043" },
        }}
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        modalProps={{
          overlayOpacity: 0.7,
        }}
      />
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <InputField
          value={formValues.date.toLocaleDateString()}
          autoFocus={false}
          placeholder='Data'
          editable={false}
          error={mutation.error?.message.date}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={formValues.date}
          mode='date'
          display='default'
          onChange={({ type }, selectedDate) => {
            setShowPicker(false);
            if (type === "set" && selectedDate) {
              setFormValues({ ...formValues, date: selectedDate });
            }
          }}
        />
      )}
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        {initialValues ? "Zapisz" : "Utwórz"}
      </Button>
    </View>
  );
};

export default ActivityForm;
