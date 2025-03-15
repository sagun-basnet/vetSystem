import React from "react";

const HomePost = () => {
    return (
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-6 mt-8">
            <div className="flex flex-col border-gray-100 rounded-sm border w-full hover:shadow-lg hover:shadow-gray-200 bg-gray-100">
                <img
                    src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3I4Qn9sgIyb2oTNBr26Y1JeFB_nlN_axqA&s"
                    }
                    alt=""
                    className="w-full h-[230px] object-cover rounded-sm"
                />
                <div className="flex flex-col px-4 py-5 gap-3">
                    <span className="font-semibold text-[20px] leading-[28px] tracking-[-0.4px]">
                        Post Name
                    </span>
                    <span className="text-[16px] leading-[24px] tracking-[-0.1px] text-[#5F6D7E]">
                        Desc: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis consequatur iure libero!
                    </span>
                    <div className="flex justify-end">

                    <button className="px-5 py-3 bg-primary rounded-sm text-white">View Post</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-gray-100 rounded-sm border w-full hover:shadow-lg hover:shadow-gray-200 bg-gray-100">
                <img
                    src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3I4Qn9sgIyb2oTNBr26Y1JeFB_nlN_axqA&s"
                    }
                    alt=""
                    className="w-full h-[230px] object-cover rounded-sm"
                />
                <div className="flex flex-col px-4 py-5 gap-3">
                    <span className="font-semibold text-[20px] leading-[28px] tracking-[-0.4px]">
                        Post Name
                    </span>
                    <span className="text-[16px] leading-[24px] tracking-[-0.1px] text-[#5F6D7E]">
                        Desc:Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis consequatur iure libero!
                    </span>
                    <div className="flex justify-end">

                    <button className="px-5 py-3 bg-primary rounded-sm text-white">View Post</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-gray-100 rounded-sm border w-full hover:shadow-lg hover:shadow-gray-200 bg-gray-100">
                <img
                    src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3I4Qn9sgIyb2oTNBr26Y1JeFB_nlN_axqA&s"
                    }
                    alt=""
                    className="w-full h-[230px] object-cover rounded-sm"
                />
                <div className="flex flex-col px-4 py-5 gap-3">
                    <span className="font-semibold text-[20px] leading-[28px] tracking-[-0.4px]">
                        Post Name
                    </span>
                    <span className="text-[16px] leading-[24px] tracking-[-0.1px] text-[#5F6D7E]">
                        Desc: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis consequatur iure libero!
                    </span>
                    <div className="flex justify-end">

                    <button className="px-5 py-3 bg-primary rounded-sm text-white">View Post</button>
                    </div>
                </div>
            </div>
           
            

            
        </div>
    );
};

export default HomePost;
