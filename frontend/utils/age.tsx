const yearForms: [string, string, string] = ["rok", "lata", "lat"];
const monthForms: [string, string, string] = ["miesiąc", "miesiące", "miesięcy"];

const getPlural = (num: number, forms: [string, string, string]): string => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return forms[0];
  }
  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return forms[1];
  }
  return forms[2];
};

export const getAge = (dateOfBirth: string) => {
  const now = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
};

export const formatAge = (years: number, months: number) => {
  const age = [];

  if (years > 0) {
    const yearLabel = getPlural(years, yearForms);
    age.push(`${years} ${yearLabel}`);
  }

  if (months > 0) {
    const monthLabel = getPlural(months, monthForms);
    age.push(`${months} ${monthLabel}`);
  }

  if (years <= 0 && months <= 0) {
    age.push("0 miesięcy");
  }

  return age.join(" ");
};
