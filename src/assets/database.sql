CREATE TABLE "user" (
	id SERIAL NOT NULL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	username TEXT NOT NULL UNIQUE,
	"photoUrl" TEXT NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE session (
	id SERIAL NOT NULL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES "user"(id),
	token UUID NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post (
	id SERIAL NOT NULL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES "user"(id),
	url TEXT NOT NULL,
	description TEXT NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "like" (
	id SERIAL NOT NULL,
	"postId" INTEGER NOT NULL REFERENCES post(id),
	"userId" INTEGER NOT NULL REFERENCES "user"(id),
	"createdAt" TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY ("postId", "userId")
);

CREATE TABLE hashtag (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "postHasHashtag" (
	id SERIAL NOT NULL,
	"postId" INTEGER NOT NULL REFERENCES post(id),
	"hashtagId" INTEGER NOT NULL REFERENCES hashtag(id),
	"createdAt" TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY ("postId", "hashtagId")
);

CREATE TABLE "rePost" (
	id SERIAL NOT NULL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES "user"(id),
	"postId" INTEGER NOT NULL REFERENCES post(id),
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "comments" (
	id SERIAL NOT NULL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES "user"(id),
	"postId" INTEGER NOT NULL REFERENCES post(id),
        "comment" TEXT NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "follow" (
	id SERIAL NOT NULL PRIMARY KEY,
	"followerId" INTEGER NOT NULL REFERENCES "user"(id),
	"followedId" INTEGER NOT NULL REFERENCES "user"(id),
	"createdAt" TIMESTAMP DEFAULT NOW()
);