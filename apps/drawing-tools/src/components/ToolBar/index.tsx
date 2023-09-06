import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useRef,
  CSSProperties,
} from "react";
import cn from "classnames";
import { HexColorPicker } from "react-colorful";

import useClickOutSide from "Hooks/useClickOutSide";
import { DrawingContext } from "Screen/Homepage";

import "./index.scss";

const InputSlide = ({
  label,
  id,
  inputValue,
  setInputValue,
}: {
  label: string;
  id: string;
  inputValue: number;
  setInputValue: Dispatch<SetStateAction<number>>;
}) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(e.target.value));
  };
  return (
    <div className="toolbar__canvas-width__wrapper">
      <div className="toolbar__canvas-width__label">
        <label htmlFor={id}>{label}</label>
        <p>{inputValue}</p>
      </div>
      <input
        type="range"
        id={id}
        min={1}
        max={50}
        onChange={onChange}
        value={inputValue}
        className="toolbar__canvas-width__range"
      />
    </div>
  );
};

const ColorPicker = ({
  colorPicker,
  label,
  setColorPicker,
}: {
  colorPicker: string;
  label: string;
  setColorPicker: Dispatch<SetStateAction<string>>;
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  useClickOutSide(colorRef.current, () => setDisplayColorPicker(false));

  const onSelectColor = (color: string) => {
    setColorPicker(color);
  };

  return (
    <div className="toolbar__color-picker">
      <label>{label}</label>
      <div
        className="toolbar__color-picker__line-selected"
        onClick={() => setDisplayColorPicker(true)}
        style={{ "--line-selected-color": colorPicker } as CSSProperties}
      />
      {displayColorPicker && (
        <div ref={colorRef} className="toolbar__color-picker__panel">
          <HexColorPicker color={colorPicker} onChange={onSelectColor} />
        </div>
      )}
    </div>
  );
};

interface Props {
  classNames?: string;
  handleClear: () => void;
  handleUndo: () => void;
}

const Toolbar: React.FC<Props> = ({ classNames, handleClear, handleUndo }) => {
  const { colorPicker, strokeWidth, setColorPicker, setStrokeWidth } =
    useContext(DrawingContext);

  return (
    <div className={cn("toolbar__wrapper", classNames)}>
      {/* stroke color */}
      <ColorPicker
        colorPicker={colorPicker}
        label={"Stroke Color"}
        setColorPicker={setColorPicker}
      />
      {/* stroke width */}
      <InputSlide
        label="Stroke Width"
        id="stroke-width"
        inputValue={strokeWidth}
        setInputValue={setStrokeWidth}
      />
      <div className="toolbar__cta-button">
        <button type="button" onClick={handleUndo}>
          Undo
        </button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
