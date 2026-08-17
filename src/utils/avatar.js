const FEMALE_VALUES = new Set([
  "1",
  "f",
  "female",
  "woman",
  "girl",
  "女",
  "女性",
]);

export const isFemaleUser = (user = {}) => {
  const values = [
    user.rawGender,
    user.rawSex,
    user.gender,
    user.sex,
    user.genderCode,
    user.sexCode,
    user.genderName,
    user.sexName,
  ];

  return values.some((value) =>
    FEMALE_VALUES.has(String(value ?? "").trim().toLowerCase()),
  );
};

export const defaultAvatarForUser = (user, avatars) =>
  isFemaleUser(user) ? avatars.female : avatars.male;
