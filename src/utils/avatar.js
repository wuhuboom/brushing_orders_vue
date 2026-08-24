const FEMALE_VALUES = new Set([
  "f",
  "female",
  "woman",
  "girl",
  "女",
  "女性",
]);

const MALE_VALUES = new Set(["m", "male", "man", "boy", "男", "男性"]);

const normalizeGenderValue = (value) =>
  String(value ?? "").trim().toLowerCase();

const genderFromLabel = (value) => {
  const normalized = normalizeGenderValue(value);
  if (FEMALE_VALUES.has(normalized)) return "female";
  if (MALE_VALUES.has(normalized)) return "male";
  return undefined;
};

const genderFromCode = (value) => {
  const labelGender = genderFromLabel(value);
  if (labelGender) return labelGender;

  const normalized = normalizeGenderValue(value);
  if (["1", "2"].includes(normalized)) return "female";
  if (normalized === "0") return "male";
  return undefined;
};

export const genderForUser = (user = {}) => {
  for (const value of [user.genderLabel, user.genderName, user.sexName]) {
    const gender = genderFromLabel(value);
    if (gender) return gender;
  }

  for (const value of [
    user.rawGender,
    user.gender,
    user.genderCode,
    user.rawSex,
    user.sex,
    user.sexCode,
  ]) {
    const gender = genderFromCode(value);
    if (gender) return gender;
  }

  return undefined;
};

export const isFemaleUser = (user = {}) => genderForUser(user) === "female";

export const defaultAvatarForUser = (_user, avatars = {}) =>
  avatars.default || avatars.male || avatars.female || "/dmk/assets/avatar.png";
