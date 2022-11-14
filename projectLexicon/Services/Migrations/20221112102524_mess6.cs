using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLexicon.Services.Migrations
{
    public partial class mess6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Conversationtoken",
                table: "Conversations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 25, 24, 486, DateTimeKind.Local).AddTicks(7770));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 25, 24, 486, DateTimeKind.Local).AddTicks(7800));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Conversationtoken",
                table: "Conversations");

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 17, 51, 284, DateTimeKind.Local).AddTicks(2840));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 17, 51, 284, DateTimeKind.Local).AddTicks(2870));
        }
    }
}
