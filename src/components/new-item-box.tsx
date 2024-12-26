import { useContext, useEffect, useId, useRef, useState } from "preact/hooks";
import { FactorioDataContext } from "../contexts/factorio-data";

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

  return <div>{displayedMessage}</div>;
};

export type NewItemPromptProps = {
  onNewEntry: (itemId: number, rate: number) => void;
  addedItems: ReadonlySet<number>;
};
export function NewItemPrompt({ onNewEntry, addedItems }: NewItemPromptProps) {
  const data = useContext(FactorioDataContext);

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
    const name = nameFieldRef.current.value;
    if (name === '' || rateStr === '') {
      return; // Silently
    }
    const rate = Number(rateStr);
    const id = data.nameToIds.items[name];
    if (id === undefined) {
      error(`There is no item called '${name}'.`);
      return;
    }

    if (!(rate > 0 && Number.isFinite(rate))) {
      error(`The rate must be a real positive number.`);
      return;
    }
    if (addedItems.has(id)) {
      error(`The item ${name} is already added to the batch.`);
      return;
    }

    const hasRelevantRecipes = data.items[id].recipesProducingThis.length > 0;
    if (!hasRelevantRecipes) {
      error(`There is no recipe that produces ${name}.`);
      return;
    }
    nameFieldRef.current.value = '';
    rateFieldRef.current.value = '';
    onNewEntry(id, rate);
  };
  return <div>
    <datalist id={itemListId}>
      {data.items.map((item, id) => <option value={item.name} key={id} />)}
    </datalist>

    <label htmlFor={itemNameId}>Item name</label>
    <input
      id={itemNameId} ref={nameFieldRef}
      type="text" list={itemListId} />
    <label htmlFor={itemRateId}>Item rate</label>

    <input
      id={itemRateId} ref={rateFieldRef}
      type="text" />

    <button onClick={onClickHandler}>Add item</button>
    <StatusMessage message={statusMessage} changeFactor={changeFactor} />
  </div>;
}