const SwitchButton = (props: { isChecked: boolean; onChange?: any; onClick?: any; small?: boolean }) => {
  const { isChecked, onChange, onClick, small } = props;

  return (
    <label className={`switch ${small ? 'small' : ''}`}>
      <input type="checkbox" checked={isChecked} onChange={onChange} onClick={onClick} />
      <span className={`slider ${small ? 'small' : ''}`} />
    </label>
  );
};

export default SwitchButton;
