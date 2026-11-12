import { useEffect, useLayoutEffect, useState } from "react"
import myHeroAcademiaImage from "@/imports/images__1_.jpg"
import MusicPlayer from "./MusicPlayer"
import StartupIntro, { shouldPlayStartupIntro } from "./StartupIntro"

const tabs = [
  "Profile",
  "Analyses",
  "Favorite",
  "Learning",
  "Reflection",
] as const
type Tab = typeof tabs[number]

const scrollRevealSelector = [
  ".hero-copy > .eyebrow",
  ".display-title",
  ".hero-bottom",
  ".profile-details > div",
  ".section-intro > *",
  ".analysis-entry",
  ".favorite-hero-content",
  ".favorite-pullquote",
  ".favorite-response-row",
  ".learning-intro-content > *",
  ".learning-row",
  ".reflection-intro-content > *",
  ".reflection-row",
  ".reflection-closing-quote",
].join(",")

const literaryAnalyses = [
  {
    title: "Voice Out of the Whirlwind (Book of Job)",
    analysis:
      "Job was a righteous man who suffered terribly, though not because he had sinned. After he cried out for justice and for God to answer, the Lord finally replied to him out of a storm. God didn’t explain the suffering. He asked Job where he was when the earth was made, and Job, humbled, saw how small his understanding was next to the Creator’s. Sometimes the answers we beg for never come the way we expect. Job wanted an explanation, and what he got was a voice from the storm that reminded him how much of life is beyond his understanding. Maybe the peace we’re looking for isn’t in knowing why, but in realizing we were never alone in the whirlwind to begin with.",
  },
  {
    title: "Odyssey",
    meta: "Homer · Archetypal Lens",
    analysis:
      "The way home is rarely a straight line. Odysseus spent ten years wandering, tempted by comforts and tested by monsters, and what carried him through was not strength alone but a stubborn memory of where he belonged. Like Odysseus, Filipinos know what it means to be far from home and still hold on to it, whether as OFWs working across oceans or as families rebuilding after another typhoon. Our strength has never been the absence of storms but the habit of getting back up, smiling through the hardship, and leaning on one another through bayanihan. The way home may be long and uncertain, but a Filipino heart carries it everywhere, and that is why we endure.",
  },
  {
    title: "Iliad",
    meta: "Homer · Psychoanalytic Lens",
    analysis:
      "The Iliad shows how pride can make a man blind: Achilles, wounded by Agamemnon’s insult, withdrew from the war, never imagining his absence would cost him Patroclus. Grief turned his pride into revenge, and in that blind rage he killed Hector and dragged his body in the dust, unable to think clearly because he saw only his own pain. Only when old King Priam knelt before him, the father of the man he killed, did Achilles recognize his own father’s grief in him and finally return the body, proving that forgiveness begins the moment we see ourselves in the people we hate.",
  },
  {
    title: "Song of Roland",
    meta: "Anonymous · Psychoanalytic Lens",
    analysis:
      "Roland’s pride cost him everything, because he refused to call for help until it was too late, and it cost the life of Oliver, the friend who saw the danger and warned him. He believed asking for help meant weakness, when it would have saved the army, his friend, and himself. Even the strongest still needs someone to lean on, and the courage to ask is often what separates a hero from a tragedy.",
  },
  {
    title: "Panchatantra: Mitra Bheda",
    meta: "Vishnu Sharma (traditionally) · Archetypal Lens",
    analysis:
      "A lion and a bull become true friends, and the jackal Damanaka, jealous of losing his influence, whispers lies until the lion kills the friend he loved. It shows how fragile an alliance is: it takes years to build and one poisoned rumor to break, especially when no one stops to ask whether it’s true. The lion’s real weakness was his power, because strength that can act without being questioned ruins character, tempting us to strike before we understand and to mistake our force for wisdom.",
  },
  {
    title: "Tale of Genji",
    meta: "Murasaki Shikibu · Feminist Lens",
    analysis:
      "The Tale of Genji suggests that Genji’s charm and endless romances were never really about love, but about a search for the mother he lost and the woman who reminded him of her. No lover could fill that emptiness, and he only understood what he had after Murasaki died and the glittering world around him began to fade. The story’s quiet truth is that beauty and affection are fleeting, and the tenderness we overlook while chasing what we lack is often the thing we’ll miss most.",
  },
  {
    title: "Les Misérables",
    meta: "Victor Hugo · Feminist Lens",
    analysis:
      "In the story, a mother will sacrifice anything and everything to provide for her loved ones. It also highlights the social injustices that women faced in those years simply because they were women. They had no legal protection, and even the law that was supposed to protect them was one of the reasons Fantine suffered. She suffered not because she was a bad person, but because society abandoned and judged her.",
  },
] as const

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const MenuButton = ({
  tab,
  active,
  onSelect,
}: {
  tab: Tab
  active: boolean
  onSelect: (tab: Tab) => void
}) => (
  <div
    className={`nav-item ${active ? "active" : ""}`}
    role="tab"
    aria-selected={active}
    tabIndex={0}
    onClick={() => onSelect(tab)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") onSelect(tab)
    }}
  >
    {tab}
  </div>
)

function Profile({ onSelect }: { onSelect: (tab: Tab) => void }) {
  return (
    <>
      <main className="hero page-enter">
        <div className="hero-copy">
          <div className="eyebrow">Great Books · Literary Portfolio</div>
          <div className="display-title">
            I think,
            <br />
            <span>therefore I am</span>
            <div className="mt-6 font-sans text-xs not-italic tracking-[0.14em] uppercase text-[var(--muted)]">
              — René Descartes
            </div>
            <div className="mt-8 max-w-md font-sans text-base leading-relaxed tracking-normal text-[var(--ink)]">
              What is a human? I don’t know yet.
              <br />
              But I’m still asking, and that is how I know I’m human.
            </div>
          </div>
          <div className="hero-bottom">
            <div className="intro h-[60px] pt-5 pb-5">
              <strong>Jancent Arlante</strong>
              <br />
              4th Year · BSIT · GB-1201
              <br />
            </div>
            <div
              className="group mb-0 inline-flex w-fit cursor-pointer items-center gap-5 self-end whitespace-nowrap rounded-full border border-white/70 bg-black/45 px-6 py-4 text-xs tracking-wide text-white shadow-[inset_0_-14px_24px_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-black/60 hover:shadow-[inset_0_-16px_28px_rgba(255,255,255,0.13)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white max-[800px]:mb-16 max-[800px]:mr-4 max-[560px]:mb-12 max-[560px]:w-full max-[560px]:self-stretch max-[560px]:justify-between [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]"
              role="button"
              tabIndex={0}
              onClick={() => onSelect("Analyses")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  onSelect("Analyses")
              }}
            >
              <span>View analyses</span>
              <span className="text-[10px] text-white/60 transition-colors group-hover:text-white">
                07
              </span>
              <Arrow />
            </div>
          </div>
        </div>

        <div className="hero-art">
          <img
            src="/hero-portrait.webp"
            alt="Portrait of Jancent Arlante wearing a traditional woven sash"
            width="1155"
            height="1362"
            decoding="async"
            fetchPriority="high"
          />
          <div className="portrait-fade" />
          <div className="art-label"></div>
          <div className="art-index">
            Plato had questions. Dante had answers.
            <br />I had both.
          </div>
        </div>
      </main>

      <section className="profile-details page-enter !border-0 !pt-[50px] !pb-[45px]">
        <div className="grid grid-cols-[minmax(48px,1fr)_3fr] border-t border-[var(--line)] py-16 max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[560px]:py-10">
          <div className="text-[10px] tracking-[0.14em] text-[var(--muted)]">
            01
          </div>
          <div>
            <div className="max-w-3xl font-['Instrument_Serif'] text-5xl leading-none max-[560px]:text-3xl">
              Brief Personal Introduction
            </div>
            <div className="mt-10 max-w-3xl space-y-6 border-l border-[var(--gold)] pl-8 text-base leading-8 text-[var(--muted)] max-[560px]:mt-7 max-[560px]:pl-5 max-[560px]:text-sm max-[560px]:leading-7">
              <div>
                I’m Jancent Arlante, a 4th-year BSIT student at the University
                of Nueva Caceres, section GB-1201. I’m a quiet person who tends
                to observe first before speaking. Great Books is part of our
                curriculum, so I didn’t choose it, but I came in open to it.
              </div>
              <div>
                As a reader, I care less about who wins a story and more about
                why its characters became who they are.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(48px,1fr)_3fr] border-t border-[var(--line)] py-16 max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[560px]:py-10">
          <div className="text-[10px] tracking-[0.14em] text-[var(--muted)]">
            02
          </div>
          <div>
            <div className="max-w-4xl font-['Instrument_Serif'] text-5xl leading-none max-[560px]:text-3xl">
              Personal Interests and Experiences in Reading and Literature
            </div>
            <div className="mt-10 max-w-3xl space-y-6 border-l border-[var(--gold)] pl-8 text-base leading-8 text-[var(--muted)] max-[560px]:mt-7 max-[560px]:pl-5 max-[560px]:text-sm max-[560px]:leading-7">
              <div>
                The first book I remember loving is{" "}
                <em>The War with Grandpa</em>. It’s about a grandson and his
                grandfather who don’t get along at first, yet the grandfather
                still opens up in his own quiet way, like bringing him along on
                fishing trips. I lost the book and was still a kid, so I don’t
                remember much of it, but I loved it enough to read it many
                times. Looking back, it reflects how many fathers act today:
                they may seem cold, but they still love you.
              </div>
              <div>
                Right now, I mostly read manga and manhwa with comedy, action,
                and adventure themes. My favorite is <em>My Hero Academia</em>,
                which was also my first anime and the reason I got into anime.
                It may be a shonen fighting story, but every fight explains why
                a character became who they are. It shows that even people who
                seem loathsome are still human, with the capacity to change,
                although that change still depends on the person. Not every
                villain has the same story. Some wanted to change society, some
                were lonely, and some were products of a failed hero society. It
                taught me that you can’t judge someone until you know what
                options they had and what they sacrificed.
              </div>
            </div>
            <div className="interest-gallery mt-12">
              {[
                {
                  title: "The War with Grandpa",
                  caption: "First book",
                  src: "/war-with-grandpa-cover.webp",
                  alt: "The War with Grandpa book cover",
                },
                {
                  title: "My Hero Academia",
                  caption: "Personal favorite manga",
                  src: myHeroAcademiaImage,
                  alt: "My Hero Academia artwork",
                },
                {
                  title: "The Greatest Estate Developer",
                  caption: "Personal favorite manhwa",
                  src: "/greatest-estate-developer.webp",
                  alt: "The Greatest Estate Developer artwork",
                },
              ].map(({ title, caption, src, alt }, index) => (
                <div
                  className="image-placeholder relative overflow-hidden"
                  key={title}
                >
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 !m-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 p-0" />
                  <span className="relative z-10 !text-white/90 drop-shadow">
                    0{index + 1}
                  </span>
                  <div className="relative z-10 text-white drop-shadow-md">
                    {title}
                  </div>
                  <small className="relative z-10 font-semibold !text-white/90 drop-shadow">
                    {caption}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(48px,1fr)_3fr] border-0 py-16 max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[560px]:py-10">
          <div className="text-[10px] tracking-[0.14em] text-[var(--muted)]">
            03
          </div>
          <div>
            <div className="max-w-4xl font-['Instrument_Serif'] text-5xl leading-none max-[560px]:text-3xl">
              Expectations and Learning Experiences in Great Books
            </div>
            <div className="mt-10 max-w-3xl space-y-6 border-l border-[var(--gold)] pl-8 text-base leading-8 text-[var(--muted)] max-[560px]:mt-7 max-[560px]:pl-5 max-[560px]:text-sm max-[560px]:leading-7">
              <div>
                I expected Great Books to be a chill subject, and it was. What I
                didn’t expect was how nervous I’d feel at first, because I had
                no friends in the section I could talk to or ask for help. So I
                took a simple approach: write everything down and listen to
                everything, like a nonchalant protagonist.
              </div>
              <div>
                As the first semester comes to an end, I realize I’ve built a
                few small connections with my professor and classmates. I’m
                proud of that, and it’s something I didn’t expect to take from
                this subject.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function InnerPage({ tab }: { tab: Exclude<Tab, "Profile"> }) {
  if (tab === "Analyses") {
    return (
      <main className="analyses-page page-enter">
        <div className="section-intro">
          <div>
            <span className="section-kicker">Compilation</span>
            <div className="inner-title">Seven literary analyses.</div>
          </div>
        </div>
        <div className="analysis-list">
          {literaryAnalyses.map((entry, index) => (
            <div className="analysis-entry cinema-mobile" key={entry.title}>
              <div className="analysis-heading">
                <span>0{index + 1}</span>
                <div>
                  <strong>{entry.title}</strong>
                  <small className="!text-[var(--gold)]">
                    {"meta" in entry
                      ? entry.meta
                      : "ANONYMOUS · Archetypal Lens"}
                  </small>
                </div>
                <span
                  className="!text-sm !text-[var(--gold)]"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
              <div className="analysis-copy">
                <div
                  className={`analysis-cover-placeholder ${
                    index <= 6 ? "relative overflow-hidden !p-0" : ""
                  }`}
                >
                  {index === 0 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/voice-out-of-whirlwind.webp"
                        alt="Voice Out of the Whirlwind book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : index === 1 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/odyssey-cover.webp"
                        alt="The Odyssey book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : index === 2 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/iliad-cover.webp"
                        alt="The Iliad book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : index === 3 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/song-of-roland.webp"
                        alt="The Song of Roland artwork"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : index === 4 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/mitra-bheda-cover.webp"
                        alt="Mitra Bheda book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : index === 5 ? (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/tale-of-genji-cover.webp"
                        alt="The Tale of Genji book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/les-miserables-cover.webp"
                        alt="Les Misérables book cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 !m-0 bg-black/20"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </div>
                <div className="analysis-text">{entry.analysis}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    )
  }

  if (tab === "Favorite") {
    const responses = [
      {
        title: "Why I chose this work",
        copy: "The story that impacted me the most was the Iliad, which I read through a psychoanalytic lens. It shows how Achilles’ pride, grief, and rage drive everything he does, and the poem stayed with me because it reflected something personal: there are times when anger blinds me.",
      },
      {
        title: "Significant themes, characters, and lessons",
        copy: "When Agamemnon takes Briseis from him, Achilles’ wounded pride makes him withdraw from the war. When Hector kills Patroclus, that pride turns into grief, and the grief into a rage that makes him drag Hector’s body behind his chariot. He only comes back to himself when King Priam comes to his tent and begs for his son’s body, and Achilles sees his own father in Priam’s grief.",
      },
      {
        title: "Personal connections and realizations",
        copy: "Anger clouds how I think and decide, and it pushes me toward “revenge” decisions. Revenge is easy, but I think you also lose yourself in the process. That moment with Priam made me realize that forgiving and forgetting are two different things, and that being able to forgive is what separates us from being merely a “person” driven by impulse. This view is only my own, and it would look different in the ancient world of wars and conflict, or from another reader’s perspective. I am not saying everyone deserves forgiveness. Forgetting someone is easier than forgiving them.",
      },
    ]

    return (
      <main className="favorite-page page-enter">
        <div className="favorite-hero">
          <img
            src="/iliad-hero-art.webp"
            alt="Classical painting of a battle from Greek mythology"
            width="1024"
            height="541"
            decoding="async"
            fetchPriority="high"
          />
          <div className="favorite-hero-shade" />
          <div className="favorite-hero-content drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
            <span className="drop-shadow-[0_2px_6px_rgba(0,0,0)]">
              My Favorite Literary Masterpiece
            </span>
            <div className="favorite-title [-webkit-text-stroke:3px_var(--black)] drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
              The Iliad
            </div>
            <div className="favorite-gold-line" />
            <div className="favorite-overview">
              <strong>Homer</strong>
              <div>
                Set during the final weeks of the Trojan War, The Iliad follows
                Achilles as rage, wounded honor, and grief draw heroes and
                nations toward devastating consequences.
              </div>
            </div>
          </div>
        </div>

        <div className="favorite-pullquote">
          <div />
          <span>“Pride lit the fire. Grief put it out.”</span>
          <div />
        </div>

        <div className="favorite-responses">
          {responses.map((response, index) => (
            <div className="favorite-response-row" key={response.title}>
              <span>0{index + 1}</span>
              <div className="favorite-response-title">{response.title}</div>
              <div className="favorite-response-copy">{response.copy}</div>
            </div>
          ))}
        </div>
      </main>
    )
  }

  if (tab === "Learning") {
    const learningRows = [
      {
        title: "Literature across periods and cultures",
        copy: "Words change from culture to culture, and over time they become literature. That is why reading a nation’s literature is one of the best ways to understand its people, as it shows life as they actually lived it.",
      },
      {
        title: "Knowledge and application of literary lenses",
        copy: "We used several lenses to read these works. I applied the archetypal lens to the Book of Job, the Odyssey, and the Panchatantra, the psychoanalytic lens to the Iliad and the Song of Roland, and the feminist lens to The Tale of Genji. Across these stories, I noticed that the heroes were often undone by their own pride.",
      },
      {
        title: "Critical thinking, interpretation, and analysis",
        copy: "As for my skills, when I have a book in my hands, I use my phone and do other things much less. I also read in a quiet spot on the school grounds, because the school library is as noisy as a market.",
      },
      {
        title: "Literature as a mirror of society",
        copy: "Two works outside the old texts stayed with me as well. Ang Huling El Bimbo reflects Philippine society for me, as the poor are the ones who suffer, and when they have no choice, some resort to illegal means. It also shows how guilt and fear can wreck a friendship, since the group left behind a “friend” who only wanted to chat and ask how they were doing. Godzilla Minus One shows the brighter side of people. When many lives are at stake, they come together to fight the threat, and the outcome is even better when no one dies.",
      },
    ]

    return (
      <main className="learning-page page-enter">
        <div className="learning-intro">
          <div className="learning-intro-content">
            <span>Summary of Learning</span>
            <div className="learning-title">What Great Books taught me.</div>
            <div className="learning-visual" aria-hidden="true">
              <img
                src="/learning-library.webp"
                alt=""
                width="1600"
                height="1150"
                decoding="async"
                fetchPriority="high"
              />
              <div />
            </div>
            <div className="learning-opening">
              Great Books taught me that literature lasts because the questions
              inside it remain alive. Across different periods and cultures, I
              learned to read not only for what happens, but for what each work
              reveals about people, power, and the choices that shape a life.
            </div>
          </div>
        </div>

        <div className="learning-list">
          {learningRows.map((row, index) => (
            <div className="learning-row" key={row.title}>
              <span>0{index + 1}</span>
              <div className="learning-row-title">{row.title}</div>
              <div className="learning-row-copy">{row.copy}</div>
            </div>
          ))}
        </div>
      </main>
    )
  }

  if (tab === "Reflection") {
    const reflectionRows = [
      {
        title: "Challenges and how I overcame them",
        copy: "The hardest part was entering worlds whose language, beliefs, and social rules were unfamiliar to me. At first, I focused so much on understanding what happened that I missed why it mattered. I learned to slow down, take notes, reread difficult passages, and connect each work to the historical setting behind it. Listening to class discussions also showed me details I would not have noticed alone.",
      },
      {
        title: "The literary lens that influenced me most",
        copy: "The psychological approach influenced me most because I naturally want to understand why a character became who they are. It helped me look beneath heroic actions, anger, pride, and romance to the fear or loss driving them. Achilles’ rage, Genji’s longing, and Job’s questions became more meaningful when I treated them not as distant figures, but as people responding imperfectly to pain.",
      },
      {
        title: "Realizations about life, society, and human nature",
        copy: "These works showed me that human nature changes less than the world around it. People from distant cultures still struggle with pride, loneliness, loyalty, grief, power, and the need to belong. Literature also revealed how societies shape individual choices and how easily strength becomes cruelty when nobody questions it. Understanding a person does not excuse every action, but it makes judgment more honest.",
      },
      {
        title: "Applying the lessons of Great Books",
        copy: "I can apply these lessons by listening before judging, asking for help before pride turns into harm, and considering what choices another person actually had. Great Books taught me to pay attention to consequences and to recognize that every conflict contains more than one human story. In daily life, that means approaching people with curiosity, thinking carefully, and choosing compassion whenever I can.",
      },
    ]

    return (
      <main className="reflection-page page-enter">
        <div className="reflection-intro">
          <div className="reflection-intro-content">
            <span>Personal Reflection</span>
            <div className="reflection-title">My journey as a reader.</div>
            <div className="reflection-visual">
              <img
                src="/reflection-reading-dog.webp"
                alt="A dog resting beside an open book"
                width="1448"
                height="1086"
                decoding="async"
                fetchPriority="high"
              />
              <div aria-hidden="true" />
            </div>
            <div className="reflection-opening">
              <div className="reflection-opening-copy">
                Before this course, literature to me was just books and anything
                you read. Now I notice what a story shows about the people and
                the society behind it. Ang Huling El Bimbo shows how the poor
                suffer and how guilt can wreck a friendship, and Godzilla Minus
                One shows people coming together when many lives are at stake.
              </div>
            </div>
          </div>
        </div>

        <div className="reflection-list">
          {reflectionRows.map((row, index) => (
            <div className="reflection-row" key={row.title}>
              <span>0{index + 1}</span>
              <div className="reflection-row-title">{row.title}</div>
              <div className="reflection-row-copy">{row.copy}</div>
            </div>
          ))}
        </div>

        <div className="reflection-closing-quote">
          “ALL PATH LEADS BACK TO ME.”
        </div>
      </main>
    )
  }

  return null
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile")
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showStartupIntro, setShowStartupIntro] = useState(
    shouldPlayStartupIntro,
  )

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 8)

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })
    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [activeTab])

  useLayoutEffect(() => {
    let observer: IntersectionObserver | undefined
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(scrollRevealSelector),
    )

    elements.forEach((element) => {
      element.classList.add("scroll-reveal")
      element.classList.remove("is-visible")
    })

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add("is-visible")
          observer?.unobserve(entry.target)
        })
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    )

    elements.forEach((element) => observer?.observe(element))
    return () => observer?.disconnect()
  }, [activeTab])

  const selectTab = (tab: Tab) => {
    setActiveTab(tab)
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <header className={isScrolled ? "scrolled" : ""}>
        <div
          className="menu-toggle"
          role="button"
          tabIndex={0}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setMenuOpen(true)
          }}
        >
          <span />
          <span />
        </div>
        <div
          className="brand"
          role="button"
          tabIndex={0}
          onClick={() => selectTab("Profile")}
        >
          GB<span>26</span>
        </div>
        <nav
          className="desktop-nav"
          role="tablist"
          aria-label="Portfolio sections"
        >
          {tabs.map((tab) => (
            <MenuButton
              key={tab}
              tab={tab}
              active={activeTab === tab}
              onSelect={selectTab}
            />
          ))}
        </nav>
      </header>

      <div
        className={`menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-top">
          <span>Navigate</span>
          <div
            className="menu-close"
            role="button"
            tabIndex={menuOpen ? 0 : -1}
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setMenuOpen(false)
            }}
          >
            <span />
            <span />
          </div>
        </div>
        <nav role="tablist" aria-label="Mobile portfolio sections">
          {tabs.map((tab, index) => (
            <div className="mobile-menu-row" key={tab}>
              <span>0{index + 1}</span>
              <MenuButton
                tab={tab}
                active={activeTab === tab}
                onSelect={selectTab}
              />
            </div>
          ))}
        </nav>
        <div className="mobile-menu-foot">Great Books · 2026</div>
      </aside>

      {activeTab === "Profile" ? (
        <Profile onSelect={selectTab} />
      ) : (
        <InnerPage tab={activeTab} />
      )}

      <footer>
        <div className="footer-main">
          <div className="footer-cta">
            <div className="footer-cta-title">Let&apos;s talk.</div>
            <div className="footer-contact-links">
              <div
                className="footer-contact-link footer-email"
                role="link"
                tabIndex={0}
                onClick={() => {
                  window.location.href = "mailto:jancent.arlante@unc.edu.ph"
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    window.location.href = "mailto:jancent.arlante@unc.edu.ph"
                  }
                }}
              >
                <span>jancent.arlante@unc.edu.ph</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div
                className="footer-contact-link"
                role="link"
                tabIndex={0}
                onClick={() =>
                  window.open(
                    "https://facebook.com/azathothdesu",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    window.open(
                      "https://facebook.com/azathothdesu",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                }}
              >
                <span>facebook.com/azathothdesu</span>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
          </div>

          <div className="footer-pages">
            <div className="footer-label">Pages</div>
            <div className="footer-page-links">
              {tabs.map((tab, index) => (
                <div
                  className={`footer-page-link ${
                    activeTab === tab ? "active" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  key={tab}
                  onClick={() => selectTab(tab)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      selectTab(tab)
                    }
                  }}
                >
                  <span className="footer-page-number">0{index + 1}</span>
                  <span>{tab}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-wordmark-wrap" aria-hidden="true">
          <div className="footer-wordmark">Jancent Arlante</div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Jancent Arlante</span>
          <span className="footer-credits">
            Images: personal photographs, literary artwork, and Peter Herrmann /
            Unsplash.{" · "}Music: Mice on Venus, C418
          </span>
          <div
            className="footer-back-top"
            role="button"
            tabIndex={0}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
          >
            Back to top ↑
          </div>
        </div>
      </footer>

      <MusicPlayer ready={!showStartupIntro} />

      {showStartupIntro && (
        <StartupIntro onComplete={() => setShowStartupIntro(false)} />
      )}
    </div>
  )
}
