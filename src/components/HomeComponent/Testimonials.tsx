import _Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = (_Slider as any).default || _Slider;

const testimonials = [
  {
    id: 1,
    name: "Abigail P.",
    text: "I have a full-time job and 3 kids. I needed the flexibility offered by InstaLearn in order to achieve my goals. My InstaLearn subscription motivated me to keep learning.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Shi Jie F.",
    text: "InstaLearn keeps me motivated to learn. With each course, I'm getting more value out of my subscription. I can access almost anything with InstaLearn!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Inés K.",
    text: "I really appreciate the flexibility I get with InstaLearn. I can try any course and switch to another one for no additional cost. This motivates me to learn even more!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    name: "David M.",
    text: "The quality of the courses on InstaLearn is outstanding. The platform makes it so easy to pick up new skills at my own pace, which is perfect for my busy schedule.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    id: 5,
    name: "Sarah L.",
    text: "I was able to transition into a new career path thanks to the specialized programs available on InstaLearn. The auto-renew feature ensures I never miss a beat in my learning journey.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  }
];

const Testimonials = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <section className="bg-white py-12 md:py-16 px-4 xl:px-0 overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <h2 className="text-[20px] md:text-[24px] lg:text-[26px] font-bold text-[#1D2026] mb-8 leading-tight">
                    What subscribers are achieving through learning
                </h2>
                
                <div className="testimonial-slider-container -mx-3">
                    <Slider {...settings}>
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="px-3 outline-none pb-8">
                                <div className="border border-[#E9EAF0] rounded-lg p-6 bg-white h-full min-h-[220px] hover:shadow-md transition-shadow duration-300 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <h3 className="font-semibold text-[#1D2026] text-[15px]">
                                            {testimonial.name}
                                        </h3>
                                    </div>
                                    <p className="text-[#4E5566] text-[14px] leading-relaxed flex-1">
                                        "{testimonial.text}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            
            <style>{`
                .testimonial-slider-container .slick-track {
                    display: flex !important;
                }
                .testimonial-slider-container .slick-slide {
                    height: inherit !important;
                }
                .testimonial-slider-container .slick-slide > div {
                    height: 100%;
                }
                .testimonial-slider-container .slick-dots {
                    bottom: -5px;
                }
                .testimonial-slider-container .slick-dots li button:before {
                    font-size: 10px;
                    color: #A1A5B3;
                }
                .testimonial-slider-container .slick-dots li.slick-active button:before {
                    color: #5624D0;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
