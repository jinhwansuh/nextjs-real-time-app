import styled from 'styled-components';
import { RoomListProps } from '../../../types/chat';

const RoomList = ({
  serverData,
  roomState,
  clientInRoom,
  handleFetchRoomData,
  handleRoomChange,
  handleCreateRoomClick,
  ...props
}: RoomListProps) => {
  if (!serverData) {
    return (
      <StyledContainer {...props}>
        <div>소켓 연결에 실패했습니다.</div>
      </StyledContainer>
    );
  }
  return (
    <StyledContainer {...props}>
      <StyledTitleWrapper>
        <div>전체 인원 : {serverData.allUserCount}</div>

        {roomState.name === '' ? (
          <div>
            <strong>방을 선택해주세요</strong>
          </div>
        ) : (
          <div>
            <strong>{roomState.name}</strong> 방 인원{' '}
            <strong>{clientInRoom}</strong>
          </div>
        )}
        <button onClick={handleFetchRoomData}>새로고침</button>
      </StyledTitleWrapper>
      <StyledRoomWrapper>
        {serverData.createdRoom.map((room) => (
          <div key={room._id}>
            <StyledRoom
              onClick={() =>
                handleRoomChange({
                  id: room._id,
                  name: room.roomName,
                })
              }
            >
              {room.roomName}
            </StyledRoom>
          </div>
        ))}
        <StyledCreateRoom onClick={handleCreateRoomClick}>
          Create a new Chat Room
        </StyledCreateRoom>
      </StyledRoomWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
`;
const StyledTitleWrapper = styled.div`
  background-color: #70b4f4;
  min-height: 130px;
`;

const StyledRoomWrapper = styled.div`
  overflow-y: auto;
  position: relative;
  background-color: #ffffff;
  padding-top: 20px;
  height: calc(100% - 130px);
`;

const StyledRoom = styled.div`
  padding: 4px;
  margin-bottom: 10px;
  width: 100%;
  height: 40px;
  border: 1px solid black;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #c6c6f3;
  }
`;

const StyledCreateRoom = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #ddd;
  height: 40px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #aaa;
  }
`;

export default RoomList;
