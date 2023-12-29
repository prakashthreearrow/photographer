import CheckBox from "./CheckBox";
import { ArrowUpIcon, DeleteIcon, TickIcon } from "../../utils/resources";
import { useEffect, useState } from "react";

export function Table(props) {
  const {
    column,
    dataSource,
    showCheckbox,
    onSelectChange,
    handleSelectedExport
  } = props;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedMap, setSelectedMap] = useState({});
  const [unSelectedMap, setUnSelectedMap] = useState({});
  const [showAction, setShowAction] = useState(false);

  const getCellRender = (col, row) => {
    return col?.render ? col.render(row) : row[col.key];
  };

  const handleSelectAll = () => {
    const currentlySelectedItems = dataSource.reduce(
      (accumulator, currValue) => ({ ...accumulator, [currValue.key]: true }),
      {}
    );
    setUnSelectedMap({});
    setSelectedMap(currentlySelectedItems);
    onSelectChange?.(currentlySelectedItems);
    setSelectAll(true);
  };

  const handleChecked = () => {
    handleSelectAll();
  };

  useEffect(() => {
    setShowAction(Object.values(selectedMap).some(value => value === true));
  }, [selectedMap]);

  useEffect(() => {
    setSelectedMap({});
    onSelectChange?.({});
    setUnSelectedMap({});
    setSelectAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return (
    <div>
      <table className="dashboard-table">
        <thead>
          <tr>
            {showCheckbox && <th></th>}
            {column.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((row, i) => (
            <>
              <tr key={i}>
                {showCheckbox && (
                  <td>
                    <CheckBox
                      className="transparent"
                      checked={Boolean(
                        selectAll
                          ? !unSelectedMap[row.key]
                          : selectedMap[row.key]
                      )}
                      onChange={e => {
                        if (selectAll) {
                          setUnSelectedMap({
                            ...unSelectedMap,
                            [row.key]: !e.target.checked
                          });
                        }

                        setSelectedMap({
                          ...selectedMap,
                          [row.key]: e.target.checked
                        });

                        onSelectChange?.({
                          ...selectedMap,
                          [row.key]: e.target.checked
                        });
                      }}
                    />
                  </td>
                )}

                {column.map((col, j) => (
                  <td key={j}>{getCellRender(col, row)}</td>
                ))}
              </tr>
            </>
          ))}
        </tbody>
      </table>
      {showAction && (
        <div className="dashboard-table__action flex around">
          <div onClick={handleChecked}>
            <TickIcon color="black" height="17" width="17" />
            <span>SELECT ALL</span>
          </div>
          <div onClick={handleSelectedExport}>
            <ArrowUpIcon height="17" width="17" />
            <span>Export</span>
          </div>
          <div>
            <DeleteIcon height="17" width="17" />
            <span>DELETE</span>
          </div>
        </div>
      )}
    </div>
  );
}
