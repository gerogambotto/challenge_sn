import React, { useState } from "react";
import { EditProfile } from "../Profile/EditProfile";

export function ModalProfile({ selectedUserData, refresh }) {
  return <EditProfile selectedUserData={selectedUserData} refresh={refresh} />;
}
