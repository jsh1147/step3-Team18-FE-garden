import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  addConnectionReq,
  deleteConnectionReq,
} from "../../../apis/mentoring/connetion";
import { convertDateToAge } from "../../../utils/age";

import Button from "../../common/Button";
import FlagTag from "../../common/FlagTag";
import Tag from "../../common/Tag";

export default function PostMenteeSide({ data }) {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const auth = window.localStorage.getItem("isLogin");

  const cid = data.connections.find(
    (connection) => connection.mentee.uid === window.localStorage.getItem("uid")
  )?.cid;

  const { mutate: addMutate } = useMutation({ mutationFn: addConnectionReq });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteConnectionReq,
  });

  const handleApplylClick = () => {
    if (auth) {
      addMutate(data.pid, {
        onSuccess: (res) => {
          toast("Successfully applied.");
          queryClient.invalidateQueries({
            queryKey: ["post", res.data.response.pid],
          });
        },
      });
    } else {
      if (
        window.confirm(
          "This service requires a login.\nWould you like to log in?"
        )
      )
        navigate("/users/login");
    }
  };

  const handleCancelClick = () => {
    if (window.confirm("Are you sure you want to cancel?"))
      deleteMutate([cid], {
        onSuccess: (res) => {
          toast("Successfully canceled.");
          queryClient.invalidateQueries({
            queryKey: ["post", res.data.response.pid],
          });
        },
      });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[58rem] m-12 flex flex-col">
        {/* 상단 - 멘토 정보 및 멘토링 제목 */}
        <div className="w-full h-fit flex">
          <img
            className="w-56 p-8 rounded-full"
            src={data.writer.profileImage}
            alt={`작성자 프로필 이미지`}
          ></img>
          <div className="w-full px-4 flex flex-col justify-center space-y-3">
            <h1 className="text-4xl font-bold text-green-700">{data.title}</h1>
            <span className="text-sm text-gray-500">{`${data.writer.firstName} ${data.writer.lastName}`}</span>
            <div className="pr-4 flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FlagTag>{data.writer.country}</FlagTag>
                <Tag>Mentor</Tag>
                {data.writer.interest.map((val, index) => (
                  <Tag key={`writertag-${index}`}>{val}</Tag>
                ))}
              </span>
              <Button
                color="white"
                size="base"
                onClick={!cid ? handleApplylClick : handleCancelClick}
              >
                {!cid ? "Apply" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
        {/* 중단 멘토링 내용 */}
        <div className="mb-8 px-6 py-12 bg-white">{data.content}</div>
        {/* 하단 멘토링 신청자 목록 */}
        <table className="text-center">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="p-2 text-left font-medium">Name</th>
              {["Country", "Favorite", "Age", "State"].map((val) => (
                <th key={`table-${val}`} className="font-medium">
                  {val}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.connections.map((value, index) => (
              <tr key={`mentee-${index}`} className="bg-white border">
                <td className="p-2 text-left space-x-2">
                  <img
                    className="inline w-8 rounded-full"
                    src={value.mentee.profileImage}
                    alt={`${value.mentee.uid} 프로필 이미지`}
                  ></img>
                  <span className="font-medium">{`${value.mentee.firstName} ${value.mentee.lastName}`}</span>
                </td>
                <td>
                  <FlagTag>{value.mentee.country}</FlagTag>
                </td>
                <td className="space-x-2">
                  {value.mentee.interest.map((val, index) => (
                    <Tag key={`menteetag-${index}`}>{val}</Tag>
                  ))}
                </td>
                <td>
                  <Tag>{convertDateToAge(value.mentee.birthDay) + ""}</Tag>
                </td>
                <td>
                  <Tag>{value.state}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
