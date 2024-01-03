import React, { useState, useEffect,useRef } from "react";
import { styled } from "styled-components";
const Dropdown = styled.div`
  position: relative;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;

  .dropdown-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    border: 2px solid #d9d9d9;
    padding: 0.7rem 0.75rem;
    gap: 15px;
    background: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:hover{
      border: 2px solid rgba(249, 208, 13, 1) ;
    }
    svg {
      width: 15px;
      height: 6px;
      fill: #d9d9d9;
    }
  }
  .dropdown-arrow {
    width: 15px;
    height: 6px;
  }
  .dropdown-content {
    top: 43px;

    position: absolute;
    z-index: 10;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    max-height: 200px;

    background-color: #ffffff;
    padding: 5px;
    width: 100%;
    overflow-y: auto;
    white-space: nowrap;
    min-width: 120px;
    p {
      margin: 10px 0;
      cursor: pointer;
      padding: 8px 15px;

      background-color: #f3f3f3;
      margin-block-start: 0em;
      margin-block-end: 0em;
      margin-bottom: 5px;
      border-radius: 4px;

      &:hover {
        background-color: #e4e2e2;
      }
    }
  }
`;

const DropdownInput: React.FC = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option: string) => {
    data.action(option);
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <Dropdown>
      <div className="dropdown-container" ref={popupRef}>
        <div
          className="dropdown-input"
          onClick={handleToggleDropdown}
          style={{ cursor: "pointer" }}
        >
          <span>
            {data?.activeTab
              ? data?.activeTab
              : data?.lable === "color"
              ? "None"
              : "Select an option"}
          </span>
          <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
            {isDropdownOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 7 4"
               
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.204703 3.79688C0.335815 3.92161 0.513615 3.99168 0.699006 3.99168C0.884397 3.99168 1.0622 3.92161 1.19331 3.79688L3.49563 1.60596L5.79795 3.79688C5.86244 3.86043 5.93959 3.91111 6.02489 3.94598C6.11019 3.98085 6.20194 3.99921 6.29477 3.99997C6.3876 4.00074 6.47967 3.98391 6.56559 3.95046C6.65151 3.917 6.72958 3.8676 6.79522 3.80513C6.86087 3.74266 6.91278 3.66838 6.94794 3.58661C6.98309 3.50484 7.00078 3.41723 6.99997 3.32889C6.99917 3.24055 6.97988 3.15325 6.94324 3.07207C6.9066 2.9909 6.85333 2.91748 6.78656 2.85611L3.98993 0.194799C3.85882 0.0700696 3.68102 2.38419e-07 3.49563 2.38419e-07C3.31024 2.38419e-07 3.13244 0.0700696 3.00133 0.194799L0.204703 2.85611C0.073632 2.98088 0 3.15008 0 3.3265C0 3.50292 0.073632 3.67212 0.204703 3.79688Z"
                  
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 7 4"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.204703 0.203117C0.335815 0.0783871 0.513615 0.0083178 0.699006 0.0083178C0.884397 0.0083178 1.0622 0.0783871 1.19331 0.203117L3.49563 2.39404L5.79795 0.203117C5.86244 0.139571 5.93959 0.088885 6.02489 0.0540159C6.11019 0.0191467 6.20194 0.000792787 6.29477 2.51208e-05C6.3876 -0.000742545 6.47967 0.0160912 6.56559 0.0495445C6.65151 0.0829978 6.72958 0.1324 6.79522 0.19487C6.86087 0.257339 6.91278 0.331624 6.94794 0.413391C6.98309 0.495157 7.00078 0.582767 6.99997 0.671109C6.99917 0.759451 6.97988 0.846755 6.94324 0.927928C6.9066 1.0091 6.85333 1.08252 6.78656 1.14389L3.98993 3.8052C3.85882 3.92993 3.68102 4 3.49563 4C3.31024 4 3.13244 3.92993 3.00133 3.8052L0.204703 1.14389C0.073632 1.01912 0 0.849925 0 0.673503C0 0.497082 0.073632 0.327884 0.204703 0.203117Z"
                  
                />
              </svg>
            )}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="dropdown-content" >
            {/* Place your dropdown options here */}
            {data.list.map((items, i) => (
              <p key={i} onClick={() => handleOptionSelect(items)}>
                {items}
              </p>
            ))}
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default DropdownInput;
const DropdownWrapper = styled.div`
  position: relative;
  min-width: 80px;
  width: 100%;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  text-align: center;

  .dropdown-input {
    
    display: flex;
    justify-content: right;
    gap: 12px;
    align-items: center;
    width: 100%;
    border-radius: 6px;
    text-align: right;
    background: #fff;
    white-space: nowrap;
  }
  .dropdown-content {
    
    bottom: 30px;

    position: absolute;
    z-index: 10;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    max-height: 200px;

    background-color: #ffffff;
    padding: 5px;
    width: 100%;
    overflow-y: auto;
    white-space: nowrap;
    min-width: 50px;
    p {
      margin: 10px 0;
      cursor: pointer;
      padding: 8px 15px;

      background-color: #f3f3f3;
      margin-block-start: 0em;
      margin-block-end: 0em;
      margin-bottom: 5px;
      border-radius: 4px;

      &:hover {
        background-color: #e4e2e2;
      }
    }
  }
  
  
`;

export const DropdownNOBorder: React.FC = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option: string) => {
    data.action(option);
    setIsDropdownOpen(false);
  };
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);


  return (
    <DropdownWrapper>
      <div className="dropdown-container" ref={popupRef}>
        <div
          className="dropdown-input"
          onClick={handleToggleDropdown}
          style={{ cursor: "pointer" }}
        >
          <span>{data?.activeTab === 0 ? "Default" : data?.activeTab}</span>
          <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
            {isDropdownOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="4"
                viewBox="0 0 7 4"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.204703 3.79688C0.335815 3.92161 0.513615 3.99168 0.699006 3.99168C0.884397 3.99168 1.0622 3.92161 1.19331 3.79688L3.49563 1.60596L5.79795 3.79688C5.86244 3.86043 5.93959 3.91111 6.02489 3.94598C6.11019 3.98085 6.20194 3.99921 6.29477 3.99997C6.3876 4.00074 6.47967 3.98391 6.56559 3.95046C6.65151 3.917 6.72958 3.8676 6.79522 3.80513C6.86087 3.74266 6.91278 3.66838 6.94794 3.58661C6.98309 3.50484 7.00078 3.41723 6.99997 3.32889C6.99917 3.24055 6.97988 3.15325 6.94324 3.07207C6.9066 2.9909 6.85333 2.91748 6.78656 2.85611L3.98993 0.194799C3.85882 0.0700696 3.68102 2.38419e-07 3.49563 2.38419e-07C3.31024 2.38419e-07 3.13244 0.0700696 3.00133 0.194799L0.204703 2.85611C0.073632 2.98088 0 3.15008 0 3.3265C0 3.50292 0.073632 3.67212 0.204703 3.79688Z"
                  fill="black"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="4"
                viewBox="0 0 7 4"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.204703 0.203117C0.335815 0.0783871 0.513615 0.0083178 0.699006 0.0083178C0.884397 0.0083178 1.0622 0.0783871 1.19331 0.203117L3.49563 2.39404L5.79795 0.203117C5.86244 0.139571 5.93959 0.088885 6.02489 0.0540159C6.11019 0.0191467 6.20194 0.000792787 6.29477 2.51208e-05C6.3876 -0.000742545 6.47967 0.0160912 6.56559 0.0495445C6.65151 0.0829978 6.72958 0.1324 6.79522 0.19487C6.86087 0.257339 6.91278 0.331624 6.94794 0.413391C6.98309 0.495157 7.00078 0.582767 6.99997 0.671109C6.99917 0.759451 6.97988 0.846755 6.94324 0.927928C6.9066 1.0091 6.85333 1.08252 6.78656 1.14389L3.98993 3.8052C3.85882 3.92993 3.68102 4 3.49563 4C3.31024 4 3.13244 3.92993 3.00133 3.8052L0.204703 1.14389C0.073632 1.01912 0 0.849925 0 0.673503C0 0.497082 0.073632 0.327884 0.204703 0.203117Z"
                  fill="black"
                />
              </svg>
            )}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="dropdown-content">
            {data.list.map((items, i) => (
              <p key={i} onClick={() => handleOptionSelect(items)}>
                {items}
              </p>
            ))}
          </div>
        )}
      </div>
    </DropdownWrapper>
  );
};
