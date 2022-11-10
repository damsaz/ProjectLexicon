using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLexicon.Services.Migrations
{
    public partial class event1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ForumPostId",
                table: "ForumPosts",
                newName: "QuotedPostId");

            migrationBuilder.CreateTable(
                name: "CommunityEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityEvents", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "UserId" },
                values: new object[] { new DateTime(2022, 11, 9, 10, 19, 29, 305, DateTimeKind.Local).AddTicks(8293), null });

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Created", "UserId" },
                values: new object[] { new DateTime(2022, 11, 9, 10, 19, 29, 305, DateTimeKind.Local).AddTicks(8346), null });

            migrationBuilder.CreateIndex(
                name: "IX_ForumThreads_ForumCategoryId",
                table: "ForumThreads",
                column: "ForumCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ForumPosts_ForumThreadId",
                table: "ForumPosts",
                column: "ForumThreadId");

            migrationBuilder.CreateIndex(
                name: "IX_ForumPosts_QuotedPostId",
                table: "ForumPosts",
                column: "QuotedPostId");

            migrationBuilder.AddForeignKey(
                name: "FK_ForumPosts_ForumPosts_QuotedPostId",
                table: "ForumPosts",
                column: "QuotedPostId",
                principalTable: "ForumPosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ForumPosts_ForumThreads_ForumThreadId",
                table: "ForumPosts",
                column: "ForumThreadId",
                principalTable: "ForumThreads",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ForumThreads_ForumCategories_ForumCategoryId",
                table: "ForumThreads",
                column: "ForumCategoryId",
                principalTable: "ForumCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ForumPosts_ForumPosts_QuotedPostId",
                table: "ForumPosts");

            migrationBuilder.DropForeignKey(
                name: "FK_ForumPosts_ForumThreads_ForumThreadId",
                table: "ForumPosts");

            migrationBuilder.DropForeignKey(
                name: "FK_ForumThreads_ForumCategories_ForumCategoryId",
                table: "ForumThreads");

            migrationBuilder.DropTable(
                name: "CommunityEvents");

            migrationBuilder.DropIndex(
                name: "IX_ForumThreads_ForumCategoryId",
                table: "ForumThreads");

            migrationBuilder.DropIndex(
                name: "IX_ForumPosts_ForumThreadId",
                table: "ForumPosts");

            migrationBuilder.DropIndex(
                name: "IX_ForumPosts_QuotedPostId",
                table: "ForumPosts");

            migrationBuilder.RenameColumn(
                name: "QuotedPostId",
                table: "ForumPosts",
                newName: "ForumPostId");

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "UserId" },
                values: new object[] { new DateTime(2022, 11, 3, 16, 39, 35, 498, DateTimeKind.Local).AddTicks(4350), "" });

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Created", "UserId" },
                values: new object[] { new DateTime(2022, 11, 3, 16, 39, 35, 498, DateTimeKind.Local).AddTicks(4404), "" });
        }
    }
}
