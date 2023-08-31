import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { TooljetDatabaseContext } from '@/TooljetDatabase/index';
import DropDownSelect from './DropDownSelect';
import { ButtonSolid } from '@/_ui/AppButton/AppButton';
import AddRectangle from '@/_ui/Icon/bulkIcons/AddRectangle';
import Trash from '@/_ui/Icon/solidIcons/Trash';
import Remove from '@/_ui/Icon/solidIcons/Remove';
import Icon from '@/_ui/Icon/solidIcons/index';
import set from 'lodash/set';
import { clone, cloneDeep, isEmpty } from 'lodash';

/**
 * {
      "joinType": "INNER",
      "table": "orders",
      "conditions": {
        "operator": "AND",
        "conditionsList": [
          {
            "operator": "=",
            "leftField": {
              "columnName": "id",
              "table": "users",
              "type": "Column"
            },
            "rightField": {
              "columnName": "user_id",
              "table": "orders",
              "type": "Column"
            }
          },
          {
            "operator": ">",
            "leftField": {
              "columnName": "order_date",
              "table": "orders",
              "type": "Column"
            },
            "rightField": {
              "value": "2022-01-01",
              "type": "Value"
            }
          }
        ]
      }
    }
  */

const JoinConstraint = ({ darkMode, index, onRemove, onChange, data }) => {
  const { columns, selectedTable, tables, loadTableInformation, tableInfo } = useContext(TooljetDatabaseContext);
  const tableList = tables.map((t) => ({ label: t, value: t }));
  //   const [leftFieldTable, setLeftFieldTable] = useState({ label: selectedTable, value: selectedTable });
  //   const [joinType, setJoinType] = useState(staticJoinOperationsList[0]);
  const joinType = data?.joinType;
  //   const [conditionsList, setConditionsList] = useState([{}]);
  //   const [operator, setOperator] = useState();
  const conditionsList = isEmpty(data?.conditions?.conditionsList) ? [{}] : data?.conditions?.conditionsList;
  const operator = data?.conditions?.operator;
  const leftFieldTable = conditionsList?.[0]?.leftField?.table || selectedTable;
  const rightFieldTable = conditionsList?.[0]?.rightField?.table;

  //   useEffect(() => {
  //     onChange &&
  //       onChange({
  //         joinType,
  //         table: leftFieldTable?.value,
  //         conditions: {
  //           operator: operator,
  //           conditionsList,
  //         },
  //       });
  //   }, [conditionsList, joinType, rightFieldTable, leftFieldTable]);

  //   const handleChange =

  return (
    <Container className="p-0">
      <Row>
        <Col sm="6" className="text-center px-2">
          Selected Table
        </Col>
        <Col sm="5" className="text-center">
          Joining Table
        </Col>
        {index !== 0 && (
          <Col sm="1" className="justify-content-end d-flex pe-0">
            <ButtonSolid variant="ghostBlack" size="sm" className="px-0" onClick={onRemove}>
              <Remove style={{ height: '16px' }} />
            </ButtonSolid>
          </Col>
        )}
      </Row>
      <Row className="border rounded mb-2">
        <Col sm="2" className="p-0 border-end">
          <div className="tj-small-btn px-2">Join</div>
        </Col>
        <Col sm="4" className="p-0 border-end">
          {index ? (
            <DropDownSelect
              options={tableList}
              darkMode={darkMode}
              onChange={(value) => {
                const newData = { ...data };
                const { conditionsList = [{}] } = newData?.conditions || {};
                const newConditionsList = conditionsList.map((condition) => {
                  const newCondition = { ...condition };
                  set(newCondition, 'leftField.table', value?.value);
                  return newCondition;
                });
                set(newData, 'conditions.conditionsList', newConditionsList);
                set(newData, 'table', value?.value);
                onChange(newData);
              }}
              value={tableList.find((val) => val?.value === leftFieldTable)}
            />
          ) : (
            <div className="tj-small-btn px-2">{selectedTable}</div>
          )}
        </Col>
        <Col sm="1" className="p-0 border-end">
          <DropDownSelect
            options={staticJoinOperationsList}
            darkMode={darkMode}
            onChange={(value) => onChange({ ...data, joinType: value?.value })}
            value={staticJoinOperationsList.find((val) => val.value === joinType)}
            renderSelected={(selected) => (selected ? <Icon name={selected?.icon} /> : '')}
          />
        </Col>
        <Col sm="5" className="p-0">
          <DropDownSelect
            options={tableList}
            darkMode={darkMode}
            onChange={(value) => {
              const newData = { ...data };
              const { conditionsList = [] } = newData?.conditions || {};
              const newConditionsList = conditionsList.map((condition) => {
                const newCondition = { ...condition };
                set(newCondition, 'rightField.table', value?.value);
                return newCondition;
              });
              set(newData, 'conditions.conditionsList', newConditionsList);
              set(newData, 'table', value?.value);
              onChange(newData);
            }}
            value={tableList.find((val) => val?.value === rightFieldTable)}
          />
        </Col>
      </Row>
      {conditionsList.map((condition, index) => (
        <JoinOn
          condition={condition}
          leftFieldTable={leftFieldTable}
          rightFieldTable={rightFieldTable}
          darkMode={darkMode}
          key={index}
          index={index}
          groupOperator={operator}
          onOperatorChange={(value) => {
            const newData = cloneDeep(data);
            set(newData, 'conditions.operator', value);
            onChange(newData);
          }}
          onChange={(value) => {
            const newConditionsList = conditionsList.map((con, i) => {
              if (i === index) {
                return value;
              }
              return con;
            });
            const newData = cloneDeep(data);
            set(newData, 'conditions.conditionsList', newConditionsList);
            onChange(newData);
          }}
          onRemove={() => {
            const newConditionsList = conditionsList.filter((cond, i) => i !== index);
            const newData = cloneDeep(data);
            set(newData, 'conditions.conditionsList', newConditionsList);
            onChange(newData);
          }}
        />
      ))}
      <Row className="mb-2">
        <Col className="p-0">
          <ButtonSolid
            variant="ghostBlue"
            size="sm"
            onClick={() => {
              const newData = { ...data };
              set(newData, 'conditions.conditionsList', [...conditionsList, {}]);
              onChange(newData);
            }}
          >
            <AddRectangle width="15" fill="#3E63DD" opacity="1" secondaryFill="#ffffff" />
            &nbsp;&nbsp; Add more
          </ButtonSolid>
        </Col>
      </Row>
    </Container>
  );
};

// {
// 	"operator": ">",
// 	"leftField": {
// 	  "columnName": "order_date",
// 	  "table": "orders",
// 	  "type": "Column"
// 	},
// 	"rightField": {
// 	  "value": "2022-01-01",
// 	  "type": "Value"
// 	}
//   }

const JoinOn = ({
  condition,
  leftFieldTable,
  rightFieldTable,
  darkMode,
  index,
  onChange,
  groupOperator,
  onOperatorChange,
  onRemove,
}) => {
  const { columns, selectedTable, tables, loadTableInformation, tableInfo } = useContext(TooljetDatabaseContext);
  const { operator, leftField, rightField } = condition;
  const leftFieldColumn = leftField?.columnName;
  const rightFieldColumn = rightField?.columnName;

  const leftFieldOptions = tableInfo[leftFieldTable]?.map((col) => ({ label: col.Header, value: col.Header })) || [];
  const rightFieldOptions = tableInfo[rightFieldTable]?.map((col) => ({ label: col.Header, value: col.Header })) || [];
  const operators = [{ label: '=', value: '=' }];
  const groupOperators = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
  ];

  return (
    <Row className="border rounded mb-2">
      <Col sm="2" className="p-0 border-end">
        {index == 1 && (
          <DropDownSelect
            options={groupOperators}
            darkMode={darkMode}
            value={groupOperators.find((op) => op.value === groupOperator)}
            onChange={(value) => {
              onOperatorChange && onOperatorChange(value?.value);
            }}
          />
        )}
        {index == 0 && <div className="tj-small-btn px-2">On</div>}
        {index > 1 && <div className="tj-small-btn px-2">{groupOperator}</div>}
      </Col>
      <Col sm="4" className="p-0 border-end">
        <DropDownSelect
          options={leftFieldOptions}
          darkMode={darkMode}
          value={leftFieldOptions.find((opt) => opt.value === leftFieldColumn)}
          onChange={(value) => {
            onChange &&
              onChange({
                ...condition,
                leftField: {
                  ...condition.leftField,
                  columnName: value?.value,
                  type: 'Column',
                  table: leftFieldTable,
                },
              });
          }}
        />
      </Col>
      <Col sm="1" className="p-0 border-end">
        <DropDownSelect
          options={operators}
          darkMode={darkMode}
          value={operators.find((op) => op.value === operator)}
          onChange={(value) => {
            onChange && onChange({ ...condition, operator: value?.value });
          }}
        />
      </Col>
      <Col sm="5" className="p-0 d-flex">
        <div className="flex-grow-1">
          <DropDownSelect
            options={rightFieldOptions}
            darkMode={darkMode}
            value={rightFieldOptions.find((opt) => opt.value === rightFieldColumn)}
            onChange={(value) => {
              onChange &&
                onChange({
                  ...condition,
                  rightField: {
                    ...condition.rightField,
                    columnName: value?.value,
                    type: 'Column',
                    table: rightFieldTable,
                  },
                });
            }}
          />
        </div>
        {index > 0 && (
          <ButtonSolid size="sm" variant="ghostBlack" className="px-1 rounded-0 border-start" onClick={onRemove}>
            <Trash fill="var(--slate9)" style={{ height: '16px' }} />
          </ButtonSolid>
        )}
      </Col>
    </Row>
  );
};

// Base Component for Join Drop Down ----------
const staticJoinOperationsList = [
  { label: 'Inner Join', value: 'INNER', icon: 'innerjoin' },
  { label: 'Left Join', value: 'LEFT', icon: 'leftouterjoin' },
  { label: 'Right Join', value: 'RIGHT', icon: 'rightouterjoin' },
  { label: 'Full Outer Join', value: 'FULL OUTER', icon: 'fullouterjoin' },
];

export default JoinConstraint;
