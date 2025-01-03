import { useContext, useEffect, useId, useRef, useState } from "preact/hooks";
import { AppControllerContext } from "../contexts/controller";

type StatusMessageProps = {
  message: string;
  changeFactor: boolean;
};
function StatusMessage({ message, changeFactor }: StatusMessageProps) {
  const nbsp = '\u00A0';
  const [displayedMessage, setDisplayedMessage] = useState(nbsp);

  useEffect(() => {
    setDisplayedMessage(message ? message : nbsp);
    const timer = setTimeout(() => { setDisplayedMessage(nbsp); }, 3000);
    return () => clearTimeout(timer);
  }, [changeFactor]);

  return <td colspan={3}>{displayedMessage}</td>;
};

export type NewItemPromptProps = {
  onNewEntry: (itemName: string, rate: number) => void;
  itemList: string[];
};
export function NewItemPrompt({ onNewEntry, itemList }: NewItemPromptProps) {
  const controller = useContext(AppControllerContext);
  const itemNameId = useId();
  const itemRateId = useId();
  const itemListId = useId();

  const [changeFactor, setChangeFactor] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const nameFieldRef = useRef<HTMLInputElement>(null!);
  const rateFieldRef = useRef<HTMLInputElement>(null!);
  const error = (message: string) => {
    setStatusMessage(message);
    setChangeFactor(!changeFactor);
  };
  const onClickHandler = () => {
    const rateStr = rateFieldRef.current.value;
    const name = nameFieldRef.current.value.toLowerCase().trim();
    console.log(nameFieldRef.current.value)
    if (name === '' || rateStr === '') {
      return; // Silently
    }
    const rate = Number(rateStr);
    const itemAvailability = controller.checkNeededItemAvailability(name);
    if (itemAvailability === 'illegal') {
      error(`There is no item called '${name}'.`);
      return;
    }

    if (!(rate > 0 && Number.isFinite(rate))) {
      error(`The rate must be a real positive number.`);
      return;
    }
    if (itemAvailability === 'used') {
      error(`The item ${name} is already added to the batch.`);
      return;
    }
    if (itemAvailability === 'noRecipe') {
      error(`There is no recipe that produces ${name}.`);
      return;
    }
    nameFieldRef.current.value = '';
    rateFieldRef.current.value = '';
    onNewEntry(name, rate);
  };
  return <>
    <tr>
      <datalist id={itemListId}>
        {itemList.map((name) => <option value={name} key={name} />)}
      </datalist>

      <td>
        <input
          id={itemNameId} ref={nameFieldRef}
          type="text" list={itemListId} />
      </td>
      <td>
        <input
          id={itemRateId} ref={rateFieldRef}
          type="text" />
      </td>

      <td>
        <button onClick={onClickHandler}>Add new item</button>
      </td>
    </tr>
    <tr>
      <StatusMessage message={statusMessage} changeFactor={changeFactor} />
    </tr>
  </>;
}