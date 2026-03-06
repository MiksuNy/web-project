import { useState } from "react";

export default function useField(type, initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { type, value, onChange, };
}
